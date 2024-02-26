import { Octokit } from 'octokit'
import { clamp, omit } from 'ramda'

export type GithubCommentModel = {
  id: number
  body?: string
  updated_at?: string
}

export type DataModel = {
  id: number
  updatedAt?: string
}

export type ModelService<D extends DataModel> = {
  create(data: Omit<D, 'id'>): Promise<D['id']>
  getById(id: D['id']): Promise<D>
  pages(params?: { page?: number; pageSize?: number }): Promise<D[]>
  update(id: D['id'], data: Partial<Omit<D, 'id'>>): Promise<D['id']>
  remove(id: D['id']): Promise<D['id']>
  count(): Promise<number>
}

export type IDBClientOptions = {
  owner: string
  repo: string
  auth: string
}

export function toData<D extends DataModel>(comment: GithubCommentModel): D {
  const { id, body, updated_at } = comment
  const data: D = JSON.parse(body || '{}')
  return { ...data, id, updatedAt: updated_at }
}

export class IDBClient {
  private owner: string
  private repo: string
  private octokit: Octokit
  private issueIdMap = new Map<string, number>()

  constructor(options: IDBClientOptions) {
    if (!options.owner) {
      throw new Error('[IDBClient]: owner is required')
    }

    if (!options.repo) {
      throw new Error('[IDBClient]: repo is required')
    }

    if (!options.auth) {
      throw new Error('[IDBClient]: auth is required')
    }

    this.owner = options.owner
    this.repo = options.repo
    this.octokit = new Octokit({
      auth: options.auth,
      // 在 nextjs 项目中
      // 数据库不需要缓存，否则容易导致数据查询错误
      request: {
        fetch: (input: any, init: any) => fetch(input, { ...init, cache: 'no-store' }),
      },
    })
  }

  private async getIssueId(tableName: string) {
    if (this.issueIdMap.has(tableName)) {
      return this.issueIdMap.get(tableName)!
    }

    const owner = this.owner
    const repo = this.repo
    const octokit = this.octokit

    let issueId = -1
    const issues = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      per_page: 100,
    })
    const match = issues.data.find((issue) => issue.title === tableName)

    if (match) {
      issueId = match.number
    } else {
      const issue = await octokit.rest.issues.create({
        owner,
        repo,
        title: tableName,
      })
      issueId = issue.data.number
    }

    this.issueIdMap.set(tableName, issueId)
    return issueId
  }

  public createService<D extends DataModel>(tableName: string): ModelService<D> {
    const owner = this.owner
    const repo = this.repo
    const octokit = this.octokit
    const $this = this

    return {
      async create(data) {
        const issueId = await $this.getIssueId(tableName)
        const res = await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
          owner,
          repo,
          issue_number: issueId,
          body: JSON.stringify(data),
        })

        return res.data.id
      },

      async getById(id) {
        const issueId = await $this.getIssueId(tableName)
        const res = await octokit.request('GET /repos/{owner}/{repo}/issues/comments/{comment_id}', {
          owner,
          repo,
          issue_number: issueId,
          comment_id: id,
        })

        return toData<D>(res.data)
      },

      async pages(params) {
        const issueId = await $this.getIssueId(tableName)
        const res = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
          owner,
          repo,
          issue_number: issueId,
          per_page: clamp(2, 100, params?.pageSize || 10),
          page: clamp(1, Infinity, params?.page || 1),
        })

        return res.data.map((comment) => toData<D>(comment))
      },

      async update(id, data) {
        const issueId = await $this.getIssueId(tableName)
        const res = await octokit.request('PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}', {
          owner,
          repo,
          issue_number: issueId,
          comment_id: id,
          body: JSON.stringify(omit(['id', 'updatedAt'], data as any)),
        })

        return res.data.id
      },

      async remove(id) {
        const issueId = await $this.getIssueId(tableName)
        await octokit.request('DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}', {
          owner,
          repo,
          issue_number: issueId,
          comment_id: id,
        })

        return id
      },

      async count() {
        const issueId = await $this.getIssueId(tableName)
        const res: any = await octokit.graphql(
          `query{repository(owner:"${owner}",name:"${repo}"){issue(number:${issueId}){comments{totalCount}}}}`,
        )

        return res.repository.issue.comments.totalCount as number
      },
    }
  }
}
