const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');
const toGeoJSON = require('togeojson');
const { DOMParser } = require('xmldom');
const { utils, write } = require('xlsx');
const xlsx = require('xlsx');

const formatErrors = (error) => {
    const errors = {};
    let errorDetails = error.details;
    errorDetails.forEach(({ path, message }) => {
        const field = path.join('.');
        errors[field] = message;
    });
    return errors;
};

const generateSlug = (text) => {
    if (!text) return '';
    return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const processKmzFile = async (kmzFile) => {
    const kmzFilePath = kmzFile.filepath;
    const kmzBuffer = fs.readFileSync(kmzFilePath);
    if (!kmzBuffer) {
        throw new Error("KMZ buffer is missing");
    }
    const zip = new AdmZip(kmzBuffer);
    const zipEntries = zip.getEntries();
    let kmlFileName = null;

    zipEntries.forEach(entry => {
        if (entry.entryName.endsWith('.kml')) {
            kmlFileName = entry.entryName;
        }
    });
    if (!kmlFileName) {
        throw new Error("No KML file found inside KMZ.");
    }
    const kmlFileData = zip.readFile(kmlFileName);
    const kml = new DOMParser().parseFromString(kmlFileData.toString(), 'text/xml');
    const geoJson = toGeoJSON.kml(kml);
    const geoJsonFolderPath = path.join(__dirname, '../geojson-files');
    if (!fs.existsSync(geoJsonFolderPath)) {
        fs.mkdirSync(geoJsonFolderPath, { recursive: true });
    };
    const timestamp = Date.now();
    const geoJsonFileName = `${timestamp}_${path.basename(kmlFileName, '.kml')}.geojson`;
    const geoJsonCreatedPath = path.join(geoJsonFolderPath, geoJsonFileName);

    fs.writeFileSync(geoJsonCreatedPath, JSON.stringify(geoJson, null, 2));
    const geoJsonUrl = `${process.env.API_URL}/geojson-files/${geoJsonFileName}`;
    return geoJsonUrl;
};

// Delete image
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(new Error(`Failed to delete file at ${filePath}: ${err.message}`));
            } else {
                resolve();
            }
        });
    });
};

const getFilePathFromUrl = (url, baseDir) => {
    const filePathRelative = url.replace(/^https?:\/\/[^\/]+/, '');
    return path.join(process.cwd(), baseDir, filePathRelative);
};

const downloadExcel = (res, modelName, worksheetData) => {
    try {
        const worksheet = utils.aoa_to_sheet(worksheetData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, modelName);
        const excelBuffer = write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=excel.xlsx`);
        res.send(excelBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: false, message: error.message });
    }
};

const parseExcelFile = async (file) => {
    const filePath = file.filepath;
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
};


module.exports = { formatErrors, generateSlug, processKmzFile, deleteFile, getFilePathFromUrl, downloadExcel, parseExcelFile }