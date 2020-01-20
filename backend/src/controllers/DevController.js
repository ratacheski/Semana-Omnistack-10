const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
const {findConnections, sendMessage} = require('../websocket')

module.exports = {
    async store(req,res){

        const { github_username, techs , latitude, longitude} = req.body;

        let dev = await Dev.findOne({ github_username });
        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login , avatar_url, bio } = response.data;
            const techsArray = parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            //Filtrar as conexões que estão à no máximo 10 km de distância 
            //e que possua pelo menos uma tecnologia do dev
            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }       
    
        return res.json(dev);
    },

    async index(req,res){
        const devs = await Dev.find();
        return res.json(devs);
    },

    async update(req,res){
        //TODO
        const dev = await Dev.update();
        return res.json(dev)
    },

    async destroy(req,res){
        //TODO
        const dev = await Dev.deleteOne();
        return res.json(dev)
    },
};