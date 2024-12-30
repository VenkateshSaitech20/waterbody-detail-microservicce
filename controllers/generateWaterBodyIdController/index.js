const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateWaterBodyId = async (req, res) => {
    try {
        let uniqueId;
        let isUnique = false;
        do {
            uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
            const existingRecord = await prisma.water_body_reviews.findFirst({
                where: { waterBodyId: uniqueId }
            });
            if (!existingRecord) {
                isUnique = true;
            }
        } while (!isUnique);
        return res.json({ result: true, message: { 'waterBodyUniqueId': uniqueId } })
    } catch (error) {
        return res.json({ result: false, message: error.message });
    }
};

module.exports = { generateWaterBodyId }