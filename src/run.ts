import { mapCommendationsResponse, ApiCommendationsComponentResponse } from './apiCommendationsComponentMapper';
import * as fs from 'fs';
import * as path from 'path';

const inputFilePath = path.join(__dirname, 'testInput.json');

fs.readFile(inputFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        return;
    }

    const input: ApiCommendationsComponentResponse = JSON.parse(data);
    const summary = mapCommendationsResponse(input);
    console.log(summary);
});
