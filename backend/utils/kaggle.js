// kaggleHelper.js
import { KaggleNode } from 'kaggle-node';

const kaggle = new KaggleNode({
  credentials: {
    username: 'manoreetkaur',
    key: '7e30215f5861e825c513e81e68bf9394',
  },
});

// Function to search for datasets based on a keyword
export async function searchDatasets(keyword) {
  try {
    const options = {
      search: keyword,
      sortBy: 'votes', // Options: 'hottest', 'votes', 'updated', 'active', 'relevance'
      // page: 1,
    };
    const datasets = await kaggle.datasets.search(options);
    return datasets.data;  // return raw dataset array
  } catch (error) {
    console.error('Error searching datasets:', error);
    throw new Error('Error searching datasets');
  }
}

// Function to display datasets based on a keyword
export async function displayDatasetOptions(keyword) {
  try {
    let datasets = await searchDatasets(keyword);

    if (datasets && datasets.length > 0) {
      console.log(`Found ${datasets.length} datasets for "${keyword}":`);

      datasets = datasets.slice(0, 5);
      datasets.forEach((dataset, index) => {
        console.log(`${index + 1}. ${dataset.title} by ${dataset.ref} - url ${dataset.url}`);
      });

      // Return datasets array with success message
      return {
        status: 200,
        data: datasets,
        message: 'Datasets recommended successfully'
      };
    } else {
      console.log(`No datasets found for "${keyword}".`);
      return {
        status: 404,
        data: [],
        message: `No datasets found for "${keyword}"`
      };
    }
  } catch (error) {
    console.error('Error displaying dataset options:', error);
    return {
      status: 500,
      data: null,
      message: 'Failed to recommend dataset'
    };
  }
}

// Function to download a dataset by its reference
export async function downloadDataset(datasetRef, downloadPath) {
  try {
    await kaggle.datasets.download(datasetRef, downloadPath);
    console.log(`Dataset ${datasetRef} downloaded to ${downloadPath}`);
  } catch (error) {
    console.error('Error downloading dataset:', error);
    throw new Error('Error downloading dataset');
  }
}
