import fetch from 'node-fetch'; // For HTTP requests
import fs from 'fs'; // For file system operations
import path from 'path';
import FormData from 'form-data';

const uploadUrl = 'https://familyneedsbd.com/lang/upload.php';

class LocalizationController {

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
    const uploadUrl = 'https://familyneedsbd.com/lang/upload.php'; // Replace with the correct upload URL

    try {

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

      // Upload the updated JSON string directly to the server
      await LocalizationController.uploadJsonToServer(jsonString, uploadUrl);

      console.log('Language updated successfully.');
      res.status(200).json({ message: 'JSON file updated successfully' });
    } catch (error) {
      console.error('Error updating JSON data:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async uploadJsonToServer(jsonString, uploadUrl) {
    try {
      const formData = new FormData();
      formData.append('file', Buffer.from(jsonString), 'data.json');

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
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
