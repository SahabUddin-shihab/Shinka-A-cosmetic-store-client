import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class LocalizationController {
  static jsonFilePath = join(__dirname, '..', 'Localization', 'data.json');

  static async readJsonFile() {
    try {
      const data = await readFile(LocalizationController.jsonFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading JSON file: ${error.message}`);
      throw new Error(`Error reading JSON file: ${error.message}`);
    }
  }

  static async writeJsonFile(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      
      // Simulating a write operation (replace with actual write logic)
      console.log('Simulating write operation...');
      console.log('Data to write:', jsonData);

     await writeFile(LocalizationController.jsonFilePath, jsonData, 'utf8');
      return 'Data updated successfully';
    } catch (error) {
      console.error(`Error writing JSON file: ${error.message}`);
      throw new Error(`Error writing JSON file: ${error.message}`);
    }
  }

  static async getData(req, res) {
    try {
      const data = await LocalizationController.readJsonFile();
      return res.json(data);
    } catch (error) {
      console.error('Error reading data:', error);
      return res.status(500).send('Error reading data');
    }
  }

  static async updateData(req, res) {
    try {
      console.log('Received new data:', req.body);
      const newData = req.body;

      // Validate input data
      if (!newData || typeof newData !== 'object') {
        console.error('Invalid input data:', newData);
        return res.status(400).send('Invalid input data');
      }

      const currentData = await LocalizationController.readJsonFile();

      // Validate current data
      if (!currentData || typeof currentData !== 'object') {
        console.error('Failed to read current data:', currentData);
        return res.status(500).json('Failed to read current data');
      }

      // Update data
      const updatedData = { ...currentData, ...newData };

      // Write updated data (simulate for read-only environment)
      const result = await LocalizationController.writeJsonFile(updatedData);

      // Send response
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error updating data:', error);
      return res.status(500).send('Error updating data');
    }
  }
}

export default LocalizationController;
