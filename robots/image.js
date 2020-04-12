const state = require('./state.js')
const google = require('googleapis').google
const customSearch = google.customsearch('v1')

//package google: https://www.npmjs.com/package/googleapis

const googleSearchCredentials = require('../credentials/google-search.json')

async function robot(){
    const content = state.load();
    
    await fetchImagesOfAllSentences(content)
    
    state.save(content);
    
    
    console.dir(content, {depth: null});
    
    async function fetchImagesOfAllSentences(content){
        for(const sentence of content.sentences){
            const query = `${content.searchTerm} ${sentence.keywords[0]}`
            sentence.images = await fetchGoogleAndReturnImagesLinks(query)
            sentence.googleSearchQuery = query
        }
    }
    
    async function fetchGoogleAndReturnImagesLinks(query){
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey,
            cx: googleSearchCredentials.searchEngineId,
            q: query,
            searchType: 'image',
            //imgSize: 'huge',
            num: 2
            //mais props: https://www.youtube.com/redirect?redir_token=5gDsUA2_NEQqemx2kyX6mUyhdd98MTU4NjgwMDg5MUAxNTg2NzE0NDkx&event=video_description&v=LzPuCVhdUew&q=https%3A%2F%2Fdevelopers.google.com%2Fapis-explorer%2F%23p%2Fcustomsearch%2Fv1%2Fsearch.cse.list
        })    
        
        const imagesUrl = response.data.items.map((item) => {
            return item.link;
        })
        
        return imagesUrl
    }
}

module.exports = robot