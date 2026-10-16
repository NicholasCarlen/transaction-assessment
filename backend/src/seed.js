const fs = require('fs');
const path = require('path');
const {PrismaClient, Prisma} = require('@prisma/client');

const prisma = new PrismaClient();

async function main(){
    const rawPath = Path.join(__dirname, 'data','viewData.json');
    const rawFile = fs.readFileSync(rawPath, 'utf-8');
    const parsed = JSON.parse(rawFile);

    for(const s of parsed.status){
        await prisma.status.upsert({
            where: {id: s.id},
            update: {name:s.name},
            create: {id: s.id,name: s.name},
        });
    }

    for(const item of parsed.data){
        await prisma.transaction.upsert({
            where:{id: item.id},
            update: {},
            create: {
            id: item.id,
            productID: String(item.productID),
            productName: item.productName,
            amount: String(item.amount),
            customerName: item.customerName,
            status: Number(item.status),
            transactionDate: new Date(item.transactionDate),
            createBy: item.createBy,
            createOn: new Date(item.createOn),
            },
        });
    }
        console.log('Database seeded successfully');
    
}

    main().catch((e) =>{
    console.error(e);
    process.exit(1);
}).finally(async ()=>{
    await prisma.$disconnect();
});




