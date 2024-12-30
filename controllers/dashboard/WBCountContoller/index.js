const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashBoardWBData = async (req, res) => {
    try {
        const pondsCount = await prisma.government_water_bodies.count({ where: { isDeleted: "N" } });
        const tankWBs = await prisma.tank_water_bodies.count({ where: { isDeleted: "N" } });
        const pwdTanks = await prisma.pwd_tanks.count({ where: { isDeleted: "N" } });
        const reviewCount = await prisma.water_body_reviews.count({ where: { verifyStatus: 1, isDeleted: "N" } });
        const countData = [
            { id: "1", name: "Ponds & Ooranis", count: pondsCount, path: "/pages/waterbody-details/GWB", icon: "bx-droplet", color: "success", colorCode: "#c1f0a8" },
            { id: "2", name: "Tank Waterbodies", count: tankWBs, path: "/pages/water-bodies-tank", icon: "bx-water", color: "secondary", colorCode: "#d3d8de" },
            { id: "3", name: "PWD Tanks", count: pwdTanks, path: "/pages/pwd-tanks", icon: "bx-file", color: "warning", colorCode: "#ffe6b3" },
            { id: "4", name: "Reviewer Summary", count: reviewCount, path: "/pages/waterbody-details/review", icon: "bx-user", color: "info", colorCode: "#b4f0fe" },
        ];
        return res.status(200).json({ result: true, message: countData });
    } catch (error) {
        return res.status(200).json({ error: error.message });
    }
}

module.exports = { getDashBoardWBData }