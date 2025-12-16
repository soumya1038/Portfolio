import sqlite3 from 'sqlite3'
import { join } from 'path'

const DB_PATH = join(process.cwd(), 'portfolio.db')

export interface AdminData {
  id: number
  name: string
  title: string
  email: string
  bio: string
  skills: string[]
  socialLinks: Record<string, string>
}

export interface ProjectData {
  id: number
  title: string
  description: string
  technologies: string[]
  image: string
  link?: string
  github?: string
}

class Database {
  private db: sqlite3.Database

  constructor() {
    this.db = new sqlite3.Database(DB_PATH)
    this.init()
  }

  private init() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS admin (
          id INTEGER PRIMARY KEY,
          name TEXT,
          title TEXT,
          email TEXT,
          bio TEXT,
          skills TEXT,
          social_links TEXT
        )
      `)

      this.db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          technologies TEXT,
          image TEXT,
          link TEXT,
          github TEXT
        )
      `)
    })
  }

  getAdmin(): Promise<AdminData | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM admin WHERE id = 1', (err, row: any) => {
        if (err) reject(err)
        if (!row) resolve(null)
        else {
          resolve({
            id: row.id,
            name: row.name,
            title: row.title,
            email: row.email,
            bio: row.bio,
            skills: JSON.parse(row.skills || '[]'),
            socialLinks: JSON.parse(row.social_links || '{}')
          })
        }
      })
    })
  }

  saveAdmin(data: Omit<AdminData, 'id'>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO admin (id, name, title, email, bio, skills, social_links) 
         VALUES (1, ?, ?, ?, ?, ?, ?)`,
        [data.name, data.title, data.email, data.bio, JSON.stringify(data.skills), JSON.stringify(data.socialLinks)],
        (err) => err ? reject(err) : resolve()
      )
    })
  }

  getProjects(): Promise<ProjectData[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM projects', (err, rows: any[]) => {
        if (err) reject(err)
        else {
          resolve(rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            technologies: JSON.parse(row.technologies || '[]'),
            image: row.image,
            link: row.link,
            github: row.github
          })))
        }
      })
    })
  }

  saveProject(data: Omit<ProjectData, 'id'>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO projects (title, description, technologies, image, link, github) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.title, data.description, JSON.stringify(data.technologies), data.image, data.link, data.github],
        function(err) {
          if (err) reject(err)
          else resolve(this.lastID)
        }
      )
    })
  }

  updateProject(id: number, data: Omit<ProjectData, 'id'>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE projects SET title=?, description=?, technologies=?, image=?, link=?, github=? WHERE id=?`,
        [data.title, data.description, JSON.stringify(data.technologies), data.image, data.link, data.github, id],
        (err) => err ? reject(err) : resolve()
      )
    })
  }

  deleteProject(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM projects WHERE id = ?', [id], (err) => err ? reject(err) : resolve())
    })
  }
}

export const db = new Database()