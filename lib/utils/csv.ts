import Papa from "papaparse";

export const loadData = <T = unknown>(string: string) => {
  return new Promise<Record<string, number[]>>((resolve, reject) => {
    return Papa.parse<T>(string, {
      download: true,
      complete(results) {
        if (results.errors.length === 0) {
          const headers = results.data.shift();

          if (Array.isArray(headers)) {
            const data: Record<string, number[]> = {};

            for (let i = 0; i < headers.length; i++) {
              const header = headers[i];
              data[header] = [];

              for (const row of results.data) {
                const value = row[i];
                const parsedValue = parseFloat(value);

                if (!isNaN(parsedValue)) {
                  data[header].push(parsedValue);
                }
              }
            }

            resolve(data);
          } else {
            reject("No headers");
          }
        } else {
          reject(results.errors);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
