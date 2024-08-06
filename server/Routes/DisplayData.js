const express = require('express');
const router = express.Router()

router.post('/foodData', (req, res) => {
    try{
        res.send([global.food_item, global.food_catgory])

        console.log(global.food_item,"Food Items")
        console.log(global.food_catgory,"Food Cate")
    }   catch (error) {
            console.error(error.message);
            res.send('Server Error')
    } 

})


module.exports = router;