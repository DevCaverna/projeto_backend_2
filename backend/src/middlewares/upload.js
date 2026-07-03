const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, unique + path.extname(file.originalname));
	},
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_EXTS = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];

const fileFilter = (req, file, cb) => {
	const ext = ALLOWED_EXTS.includes(
		path.extname(file.originalname).toLowerCase(),
	);
	const mime = ALLOWED_MIMES.includes(file.mimetype);
	if (ext && mime) return cb(null, true);
	cb(
		Object.assign(
			new Error(
				'Apenas imagens (jpeg, jpg, png, gif, webp) são permitidas',
			),
			{
				code: 'INVALID_FILE_TYPE',
			},
		),
	);
};

module.exports = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 },
});
