var http = require('http');
var fs = require('fs');

const DATA_DIRECTORY = __dirname + '/public/data';
const CATALOG_FILE = DATA_DIRECTORY + '/catalog.json';

var fileList = [
    {
        type: 'pre-1980',
        year:"1900",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1900.csv'
    },
    {
        type: 'pre-1980',
        year:"1901",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1901.csv'
    },
    {
        type: 'pre-1980',
        year:"1902",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1902.csv'
    },
    {
        type: 'pre-1980',
        year:"1903",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1903.csv'
    },
    {
        type: 'pre-1980',
        year:"1904",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1904.csv'
    },
    {
        type: 'pre-1980',
        year:"1905",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1905.csv'
    },
    {
        type: 'pre-1980',
        year:"1906",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1906.csv'
    },
    {
        type: 'pre-1980',
        year:"1907",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1907.csv'
    },
    {
        type: 'pre-1980',
        year:"1908",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1908.csv'
    },
    {
        type: 'pre-1980',
        year:"1909",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1909.csv'
    },
    {
        type: 'pre-1980',
        year:"1910",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1910.csv'
    },
    {
        type: 'pre-1980',
        year:"1911",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1911.csv'
    },
    {
        type: 'pre-1980',
        year:"1912",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1912.csv'
    },
    {
        type: 'pre-1980',
        year:"1913",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1913.csv'
    },
    {
        type: 'pre-1980',
        year:"1914",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1914.csv'
    },
    {
        type: 'pre-1980',
        year:"1915",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1915.csv'
    },
    {
        type: 'pre-1980',
        year:"1916",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1916.csv'
    },
    {
        type: 'pre-1980',
        year:"1917",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1917.csv'
    },
    {
        type: 'pre-1980',
        year:"1918",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1918.csv'
    },
    {
        type: 'pre-1980',
        year:"1919",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1919.csv'
    },
    {
        type: 'pre-1980',
        year:"1920",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1920.csv'
    },
    {
        type: 'pre-1980',
        year:"1921",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1921.csv'
    },
    {
        type: 'pre-1980',
        year:"1922",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1922.csv'
    },
    {
        type: 'pre-1980',
        year:"1923",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1923.csv'
    },
    {
        type: 'pre-1980',
        year:"1924",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1924.csv'
    },
    {
        type: 'pre-1980',
        year:"1925",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1925.csv'
    },
    {
        type: 'pre-1980',
        year:"1926",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1926.csv'
    },
    {
        type: 'pre-1980',
        year:"1927",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1927.csv'
    },
    {
        type: 'pre-1980',
        year:"1928",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1928.csv'
    },
    {
        type: 'pre-1980',
        year:"1929",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1929.csv'
    },
    {
        type: 'pre-1980',
        year:"1930",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1930.csv'
    },
    {
        type: 'pre-1980',
        year:"1931",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1931.csv'
    },
    {
        type: 'pre-1980',
        year:"1932",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1932.csv'
    },
    {
        type: 'pre-1980',
        year:"1933",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1933.csv'
    },
    {
        type: 'pre-1980',
        year:"1934",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1934.csv'
    },
    {
        type: 'pre-1980',
        year:"1935",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1935.csv'
    },
    {
        type: 'pre-1980',
        year:"1936",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1936.csv'
    },
    {
        type: 'pre-1980',
        year:"1937",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1937.csv'
    },
    {
        type: 'pre-1980',
        year:"1938",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1938.csv'
    },
    {
        type: 'pre-1980',
        year:"1939",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1939.csv'
    },
    {
        type: 'pre-1980',
        year:"1940",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1940.csv'
    },
    {
        type: 'pre-1980',
        year:"1941",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1941.csv'
    },
    {
        type: 'pre-1980',
        year:"1942",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1942.csv'
    },
    {
        type: 'pre-1980',
        year:"1943",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1943.csv'
    },
    {
        type: 'pre-1980',
        year:"1944",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1944.csv'
    },
    {
        type: 'pre-1980',
        year:"1945",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1945.csv'
    },
    {
        type: 'pre-1980',
        year:"1946",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1946.csv'
    },
    {
        type: 'pre-1980',
        year:"1947",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1947.csv'
    },
    {
        type: 'pre-1980',
        year:"1948",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1948.csv'
    },
    {
        type: 'pre-1980',
        year:"1949",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1949.csv'
    },
    {
        type: 'pre-1980',
        year:"1950",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1950.csv'
    },
    {
        type: 'pre-1980',
        year:"1951",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1951.csv'
    },
    {
        type: 'pre-1980',
        year:"1952",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1952.csv'
    },
    {
        type: 'pre-1980',
        year:"1953",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1953.csv'
    },
    {
        type: 'pre-1980',
        year:"1954",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1954.csv'
    },
    {
        type: 'pre-1980',
        year:"1955",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1955.csv'
    },
    {
        type: 'pre-1980',
        year:"1956",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1956.csv'
    },
    {
        type: 'pre-1980',
        year:"1957",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1957.csv'
    },
    {
        type: 'pre-1980',
        year:"1958",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1958.csv'
    },
    {
        type: 'pre-1980',
        year:"1959",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1959.csv'
    },
    {
        type: 'pre-1980',
        year:"1960",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1960.csv'
    },
    {
        type: 'pre-1980',
        year:"1961",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1961.csv'
    },
    {
        type: 'pre-1980',
        year:"1962",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1962.csv'
    },
    {
        type: 'pre-1980',
        year:"1963",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1963.csv'
    },
    {
        type: 'pre-1980',
        year:"1964",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1964.csv'
    },
    {
        type: 'pre-1980',
        year:"1965",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1965.csv'
    },
    {
        type: 'pre-1980',
        year:"1966",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1966.csv'
    },
    {
        type: 'pre-1980',
        year:"1967",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1967.csv'
    },
    {
        type: 'pre-1980',
        year:"1968",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1968.csv'
    },
    {
        type: 'pre-1980',
        year:"1969",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1969.csv'
    },
    {
        type: 'pre-1980',
        year:"1970",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1970.csv'
    },
    {
        type: 'pre-1980',
        year:"1971",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1971.csv'
    },
    {
        type: 'pre-1980',
        year:"1972",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1972.csv'
    },
    {
        type: 'pre-1980',
        year:"1973",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1973.csv'
    },
    {
        type: 'pre-1980',
        year:"1974",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1974.csv'
    },
    {
        type: 'pre-1980',
        year:"1975",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1975.csv'
    },
    {
        type: 'pre-1980',
        year:"1976",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1976.csv'
    },
    {
        type: 'pre-1980',
        year:"1977",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1977.csv'
    },
    {
        type: 'pre-1980',
        year:"1978",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1978.csv'
    },
    {
        type: 'pre-1980',
        year:"1979",
        url:'http://www.census.gov/popest/data/national/asrh/pre-1980/tables/PE-11-1979.csv'
    },
    {
        type: '1980s',
        year:"1980",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8081rqi.zip'
    },
    {
        type: '1980s',
        year:"1981",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8182rqi.zip'
    },
    {
        type: '1980s',
        year:"1982",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8283rqi.zip'
    },
    {
        type: '1980s',
        year:"1983",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8384rqi.zip'
    },
    {
        type: '1980s',
        year:"1984",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8485rqi.zip'
    },
    {
        type: '1980s',
        year:"1985",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8586rqi.zip'
    },
    {
        type: '1980s',
        year:"1986",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8687rqi.zip'
    },
    {
        type: '1980s',
        year:"1987",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8788rqi.zip'
    },
    {
        type: '1980s',
        year:"1988",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8889rqi.zip'
    },
    {
        type: '1980s',
        year:"1989",
        url:'http://www.census.gov/popest/data/national/asrh/1980s/tables/e8990rqi.zip'
    },
    {
        type: 'post-1989',
        year:"1990",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1990.csv'
    },
    {
        type: 'post-1989',
        year:"1991",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1991.csv'
    },
    {
        type: 'post-1989',
        year:"1992",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1992.csv'
    },
    {
        type: 'post-1989',
        year:"1993",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1993.csv'
    },
    {
        type: 'post-1989',
        year:"1994",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1994.csv'
    },
    {
        type: 'post-1989',
        year:"1995",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1995.csv'
    },
    {
        type: 'post-1989',
        year:"1996",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1996.csv'
    },
    {
        type: 'post-1989',
        year:"1997",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1997.csv'
    },
    {
        type: 'post-1989',
        year:"1998",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1998.csv'
    },
    {
        type: 'post-1989',
        year:"1999",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-1999.csv'
    },
    {
        type: 'post-1989',
        year:"2000",
        url:'http://www.census.gov/popest/data/intercensal/national/files/US-EST90INT-07-2000.csv'
    }
];

var filesLeft = fileList.length;
var downloadLimit = Math.min(fileList.length, 10);
var catalog = {};

function downloadFile(type, year, url, filePath, next) {
    var file = fs.createWriteStream(filePath);
    http.get(url, function(response) {
        file.on('finish', () => {
            catalog[type] = catalog[type] || {};
            catalog[type][year] = filePath.replace(/^([^\/]*\/)+/, '');
            filesLeft--;
            next();
        });
        response.pipe(file);
    });
}

function startNextFile() {
    if(fileList.length > 0) {
        var item = fileList.pop();
        var newFile = item.url;
        var savePath = DATA_DIRECTORY + '/' + newFile.replace(/^([^\/]*\/)+/, '');
        console.log('Saving', newFile, 'as', savePath);
        downloadFile(item.type, item.year, newFile, savePath, startNextFile);
    } else if(filesLeft < 1) {
        console.log('Saving data catalog...');
        fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, undefined, 4));
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
