import fetch from 'node-fetch'; // For HTTP requests
import fs from 'fs'; // For file system operations
import path from 'path';
import FormData from 'form-data';

const uploadUrl = 'https://familyneedsbd.com/lang/upload.php';

class LocalizationController {
  // static jsonFilePath = join(__dirname, '..', 'Localization', 'data.json');

  // static async readJsonFile() {
  //   try {
  //     const data = await readFile(LocalizationController.jsonFilePath, 'utf8');
  //     return JSON.parse(data);
  //   } catch (error) {
  //     console.error(`Error reading JSON file: ${error.message}`);
  //     throw new Error(`Error reading JSON file: ${error.message}`);
  //   }
  // }

  // static async writeJsonFile(data) {
  //   try {
  //     const jsonData = JSON.stringify(data, null, 2);
      
  //     // Simulating a write operation (replace with actual write logic)
  //     console.log('Simulating write operation...');
  //     console.log('Data to write:', jsonData);

  //    await writeFile(LocalizationController.jsonFilePath, jsonData, 'utf8');
  //     return 'Data updated successfully';
  //   } catch (error) {
  //     console.error(`Error writing JSON file: ${error.message}`);
  //     throw new Error(`Error writing JSON file: ${error.message}`);
  //   }
  // }


  static async getData(req, res) {
    try {
      const response = await fetch('https://familyneedsbd.com/lang/data.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching JSON from URL:', error);
      throw error;
    }
  }

  static async updateData(req, res) {
    const dataUrl = 'https://familyneedsbd.com/lang/data.json';

    try {
      // Fetch existing data
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch existing data');
      }

      const existingData = await response.json();
      const updateData = req.body;

      // Validate updateData
      if (!updateData || typeof updateData !== 'object') {
        throw new Error('Invalid update data');
      }

      // Update data
      const updatedData = { ...existingData, ...updateData };

      // Convert updated data to JSON string
      const jsonString = JSON.stringify(updatedData, null, 2);

      // Save JSON to a temporary file (locally)
      const tempFilePath = path.join(process.cwd(), 'temp.json');
      fs.writeFileSync(tempFilePath, jsonString, 'utf8');

      // Upload the file to the server
      await LocalizationController.uploadFileToServer(tempFilePath, uploadUrl);

      // Clean up temporary file
      fs.unlinkSync(tempFilePath);

      console.log('JSON file updated successfully.');
      res.status(200).json({ message: 'JSON file updated successfully' });
    } catch (error) {
      console.error('Error updating JSON data:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async uploadFileToServer(filePath, uploadUrl) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), { filename: 'temp.json' });

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: formData.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

export default LocalizationController;
