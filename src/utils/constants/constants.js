import universite from '@/assets/organisation/universiteTours.png'
import adconseilImage from '@/assets/organisation/adconseil.png'
const INDEX_FIRST_QUESTION = 16;

const APPNAME = 'QVTi — Quality of Work Life Analytics'
const ORGANISATIONS = [ 
    {   nomOrganisation: 'Universite de Tours' ,
        imgSource : universite ,
        description : "L'université de Tours est une université pluridisciplinaire française située à Tours. \
         Elle prend la dénomination d'université de Tours,  \
         lors du CA du 18 décembre 2017 , en lieu et place de l'université François-Rabelais. \
         Il s'agit de la plus grande université de la région Centre-Val de Loire" } , 
    {
        nomOrganisation: 'AD CONSEIL',
        imgSource :adconseilImage ,
        description : "QVT et performance durable \
                       Nous œuvrons pour des environnements de travail porteurs de sens et garants de la santé et de la qualité de vie au travail",
    }
];
const COULEURS = 
[
   "f0f8ff",
   "faebd7",
   "00ffff" ,
   "7fffd4",
   "f0ffff",
   "f5f5dc",
   "ffe4c4", 
   "000000",
   "ffebcd",
   "0000ff",
   "8a2be2",
   "a52a2a",
   "deb887",
   "5f9ea0",
   "7fff00",
   "d2691e",
   "ff7f50",
   "6495ed",
   "fff8dc",
   "dc143c",
   "00ffff",
   "00008b",
   "008b8b",
   "b8860b",
   "006400",
   "a9a9a9",
   "bdb76b",
   "8b008b",
   "556b2f",
   "ff8c00",
   "9932cc",
   "8b0000",
   "e9967a",
   "8fbc8f",
   "483d8b",
   "2f4f4f" ,
   "2f4f4f",
   "00ced1",
   "9400d3",
   "ff1493",
   "00bfff",
   "4682b4",
   "d2b48c",
   "9acd32"
   ];

export {
    COULEURS,
    INDEX_FIRST_QUESTION,
    ORGANISATIONS ,
    APPNAME,
};

