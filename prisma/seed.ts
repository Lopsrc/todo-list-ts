import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const progresses = [{description: "to do"}, {description: "complete"}, {description: "in progress"}];
    await prisma.progress.createMany({data: progresses})
}
main()
.then(async () => {
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})