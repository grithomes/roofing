const express = require('express');
const router = express.Router()

router.get('/testapi', (req, res) => {
    console.log("Hello")
    try{
        res.status(200).json({
            status: "success",
            
          });

    }   catch (error) {
            console.error(error.message);
            res.send('Server Error')
    } 

})


module.exports = router;