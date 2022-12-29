const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/coordinated-various-slicer|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/roomy-jumpy-editor|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/thinkable-whimsical-pot|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/petalite-fanatical-pick|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/dune-alkaline-haze|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/adorable-emerald-megalosaurus|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/immediate-just-tango|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/tested-astonishing-bladder|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/shining-aback-moat|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/splashy-copper-education|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/thread-almond-pencil|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/chipped-fish-fir|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/planet-adventurous-tarantula|https://dc38c7a5-db25-4bd3-b71b-3cd8609a0980@api.glitch.com/git/young-amazing-ant`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();