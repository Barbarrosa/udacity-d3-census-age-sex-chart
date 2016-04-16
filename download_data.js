var http = require('http');
var fs = require('fs');

const DATA_DIRECTORY = __dirname + '/public/data';

var fileList = [
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1900.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1901.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1902.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1903.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1904.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1905.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1906.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1907.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1908.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1909.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1910.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1911.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1912.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1913.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1914.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1915.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1916.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1917.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1918.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1919.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1920.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1921.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1922.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1923.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1924.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1925.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1926.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1927.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1928.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1929.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1930.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1931.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1932.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1933.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1934.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1935.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1936.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1937.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1938.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1939.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1940.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1941.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1942.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1943.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1944.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1945.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1946.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1947.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1948.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1949.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1950.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1951.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1952.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1953.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1954.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1955.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1956.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1957.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1958.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1959.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1960.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1961.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1962.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1963.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1964.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1965.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1966.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1967.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1968.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1969.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1970.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1971.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1972.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1973.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1974.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1975.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1976.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1977.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1978.csv',
    'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1979.csv',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8081rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8182rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8283rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8384rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8485rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8586rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8687rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8788rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8889rqi.zip',
    'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8990rqi.zip',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1990.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1991.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1992.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1993.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1994.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1995.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1996.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1997.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1998.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1999.csv',
    'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-2000.csv'
];

var filesLeft = fileList.length;
var downloadLimit = Math.min(fileList.length, 10);

function downloadFile(url, file, next) {
    var file = fs.createWriteStream(file);
    http.get(url, function(response) {
        file.on('finish', () => {
            filesLeft--;
            next();
        });
        response.pipe(file);
    });
}

function startNextFile() {
    if(fileList.length > 0) {
        var newFile = fileList.pop();
        var savePath = DATA_DIRECTORY + '/' + newFile.replace(/^([^\/]*\/)+/, '');
        console.log('Saving', newFile, 'as', savePath);
        downloadFile(newFile, savePath, startNextFile);
    } else if(filesLeft < 1) {
        console.log('Finished downloading files.');
    }
}

if( ! fs.existsSync(DATA_DIRECTORY)) {
    console.log('Creating data directory at [', DATA_DIRECTORY, ']...');
    fs.mkdirSync(DATA_DIRECTORY);
}

console.log('Downloading data files...');
for(var i = 0; i < downloadLimit; i++) {
    startNextFile();
}
