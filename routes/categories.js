// const {Category} = require('../models/category');
// const express = require('express');
// const router = express.Router();
// const multer = require('multer')

// var upload   = multer({ dest: "/public/uploads" })

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// }
// // Making the name and path for image
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('invalid image type');

//         if(isValid) {
//             uploadError = null
//         }
//       cb(uploadError, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
        
//       const fileName = file.originalname.split(' ').join('-');
//       const extension = FILE_TYPE_MAP[file.mimetype];
//       cb(null, `${fileName}-${Date.now()}.${extension}`)
//     }
//   })
  
// const uploadOptions = multer({ storage: storage })


// router.get(`/`, async (req, res) =>{
//     const categoryList = await Category.find();

//     if(!categoryList) {
//         res.status(500).json({success: false})
//     } 
//     res.status(200).send(categoryList);
// })

// router.get('/:id', async(req,res)=>{
//     const category = await Category.findById(req.params.id);

//     if(!category) {
//         res.status(500).json({message: 'The category with the given ID was not found.'})
//     } 
//     res.status(200).send(category);
// })



// router.post('/',uploadOptions.single('image'), async (req,res)=>{
    
//     const file = req.file;
//     if(!file) return res.status(400).send('No image in the request')

//     const fileName = file.filename
//     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
//     let category = new Category({
//         name: req.body.name,
//         icon: `${basePath}${fileName}`,
//         color: req.body.color
//     })
//     category = await category.save();

//     if(!category)
//     return res.status(400).send('the category cannot be created!')

//     res.send(category);
// })


// router.put('/:id',async (req, res)=> {
//     const category = await Category.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             icon: req.body.icon || category.icon,
//             color: req.body.color,
//         },
//         { new: true}
//     )

//     if(!category)
//     return res.status(400).send('the category cannot be created!')

//     res.send(category);
// })

// router.delete('/:id', (req, res)=>{
//     Category.findByIdAndRemove(req.params.id).then(category =>{
//         if(category) {
//             return res.status(200).json({success: true, message: 'the category is deleted!'})
//         } else {
//             return res.status(404).json({success: false , message: "category not found!"})
//         }
//     }).catch(err=>{
//        return res.status(500).json({success: false, error: err}) 
//     })
// })

// module.exports =router;
















































// tmp/uploads dir.................................................................................................................................................






const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define the upload directory
const uploadDir = '/tmp/uploads';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Configure disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, uploadDir);
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(categoryList);
});

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' });
    }
    res.status(200).send(category);
});

router.post('/', uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    let category = new Category({
        name: req.body.name,
        icon: `${basePath}${fileName}`,
        color: req.body.color
    });
    category = await category.save();

    if (!category)
        return res.status(400).send('the category cannot be created!');

    res.send(category);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    let iconPath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
        iconPath = `${basePath}${fileName}`;
    } else {
        iconPath = req.body.icon;
    }

    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: iconPath,
            color: req.body.color,
        },
        { new: true }
    );

    if (!category)
        return res.status(400).send('the category cannot be created!');

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "category not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
