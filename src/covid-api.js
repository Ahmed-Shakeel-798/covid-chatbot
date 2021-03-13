const request = require('request');
const rp = require('request-promise-native');


const rapidapikey = process.env.RAPIDAPIKEY;
const rapidapihost = process.env.RAPIDAPIHOST;


const options = {
  method: 'GET',
  url: 'https://covid-193.p.rapidapi.com/statistics',
  qs: { country: 'Pakistan' },
  headers: {
    'x-rapidapi-key': rapidapikey,
    'x-rapidapi-host': rapidapihost,
    useQueryString: true
  }
};


const getStats = async () => {
  try {
    let response = await rp(options.url, {
      method: 'GET',
      qs: options.qs,
      headers: options.headers,
    });

    let result = JSON.parse(response);

    let newCases = result["response"][0]["cases"]["new"];
    let newDeaths = result["response"][0]["deaths"]["new"];
    let activeCases = result["response"][0]["cases"]["active"];
    let criticalCases = result["response"][0]["cases"]["critical"];
    let totalCases = result["response"][0]["cases"]["total"];
    let totalDeaths = result["response"][0]["deaths"]["total"];
    let recovered = result["response"][0]["cases"]["recovered"];

    let stats = `
        Covid-19 statistics (Pakistan)

        New Cases : ${newCases}
        New Deaths: ${newDeaths}

        Active Cases: ${activeCases}
        Critical cases: ${criticalCases}
        
        Total Cases: ${totalCases}
        Total Deaths: ${totalDeaths}
        Recovered: ${recovered}

        Please take necessary precautions 
        
        To go back to the main menu
        type 0 
      `;

    console.log(typeof (stats));
    return (stats);


  } catch (error) {
    console.log(e);
    return ("Can't fetch results");
  }

}
//let mystats = getStats();

const getSymptoms = async () => {
  let symptoms = `
  Most common symptoms:
    fever
    dry cough
    tiredness
  Less common symptoms:
    aches and pains
    sore throat
    diarrhoea
    conjunctivitis
    headache
    loss of taste or smell
    a rash on skin, or discolouration of fingers or toes
  Serious symptoms:
    difficulty breathing or shortness of breath
    chest pain or pressure
    loss of speech or movement
  Seek immediate medical attention if you have serious symptoms. Always call before visiting your doctor or health facility.
  People with mild symptoms who are otherwise healthy should manage their symptoms at home.
  
  On average it takes 5–6 days from when someone is infected with the virus for symptoms to show, however it can take up to 14 days.
  
  To go back to the main menu
  type 0 
  `;
  return (symptoms);
}


const getPrecautions = () => {
  let precautions = `
  To prevent the spread of COVID-19:
    -Clean your hands often. Use soap and water, or an alcohol-based hand rub.
    -Maintain a safe distance from anyone who is coughing or sneezing.
    -Wear a mask when physical distancing is not possible.
    -Don’t touch your eyes, nose or mouth.
    -Cover your nose and mouth with your bent elbow or a tissue when you cough or sneeze.
    -Stay home if you feel unwell.
    -If you have a fever, cough and difficulty breathing, seek medical attention.
  
    Calling in advance allows your healthcare provider to quickly direct you to the right health facility. This protects you, and prevents the spread of viruses and other infections.
  
    To go back to the main menu
    type 0 
    `;
  return (precautions);
}


const getRemedies = async () => {
  let remedies = `
  After exposure to someone who has COVID-19, do the following:
    -Call your health care provider or COVID-19 hotline to find out where and when to get a test.
    -Cooperate with contact-tracing procedures to stop the spread of the virus.
    -If testing is not available, stay home and away from others for 14 days.
    -While you are in quarantine, do not go to work, to school or to public places. Ask someone to bring you supplies.
    -Keep at least a 1-metre distance from others, even from your family members.
    -Wear a medical mask to protect others, including if/when you need to seek medical care.
    -Clean your hands frequently.
    -Stay in a separate room from other family members, and if not possible, wear a medical mask.
    -Keep the room well-ventilated.
    -If you share a room, place beds at least 1 metre apart.
    -Monitor yourself for any symptoms for 14 days.
    -Call your health care provider immediately if you have any of these danger signs: difficulty breathing, loss of speech or mobility, confusion or chest pain.
    -Stay positive by keeping in touch with loved ones by phone or online, and by exercising at home.
  
    To go back to the main menu
    type 0 
    `;
  return (remedies);
}




module.exports = {
  getStats: getStats,
  getPrecautions: getPrecautions,
  getRemedies: getRemedies,
  getSymptoms: getSymptoms
};