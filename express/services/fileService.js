const fs = require('fs').promises;
const path = require('path');

const fileService = {
    async saveFiles(files, type) {
        if (!files) return null;
        
        try {
            const uploadDir = `public/${type}`;
            
            // Ensure directory exists
            try {
                await fs.access(uploadDir);
            } catch (error) {
                await fs.mkdir(uploadDir, { recursive: true });
            }
            
            // If single file
            if (!Array.isArray(files)) {
                return files.filename;
            }
            
            // If multiple files
            return files.map(file => file.filename);
        } catch (error) {
            console.error(`Error saving ${type} files:`, error);
            throw error;
        }
    },

    async deleteFiles(filenames, type) {
        if (!filenames) return;
        
        const files = Array.isArray(filenames) ? filenames : [filenames];
        
        await Promise.all(
            files.map(filename => {
                if (!filename) return Promise.resolve();
                
                return fs.unlink(path.join(`public/${type}`, filename))
                    .catch(err => console.error(`Failed to delete file ${filename}:`, err));
            })
        );
    }
};

module.exports = fileService;