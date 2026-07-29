import path from 'node:path'
import { getApps } from '@epic-web/workshop-utils/apps.server'
import { execa } from 'execa'
import fsExtra from 'fs-extra'

const allApps = await getApps()

for (const app of allApps) {
	const reactRouterConfig = path.join(app.fullPath, 'react-router.config.ts')
	if (await fsExtra.pathExists(reactRouterConfig)) {
		console.log(`Generating React Router types for ${app.relativePath}`)
		await execa('npm', ['exec', '--', 'react-router', 'typegen'], {
			cwd: app.fullPath,
			stdio: 'inherit',
		})
	}

	const prismaSchema = path.join(app.fullPath, 'prisma', 'schema.prisma')
	if (await fsExtra.pathExists(prismaSchema)) {
		console.log(`Generating Prisma client for ${app.relativePath}`)
		await execa('npm', ['exec', '--', 'prisma', 'generate', '--sql'], {
			cwd: app.fullPath,
			stdio: 'inherit',
		})
	}
}
