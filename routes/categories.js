// const {Category} = require('../models/category');
// const express = require('express');
// const router = express.Router();
// const multer = require('multer')

// var upload   = multer({ dest: "/tmp/uploads" })

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
//       cb(uploadError, 'tmp/uploads')
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
//     const basePath = `${req.protocol}://${req.get('host')}/tmp/uploads/`;
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



const express = require('express');
const { Category } = require('../models/category');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinaryConfig'); // Import Cloudinary upload function
const router = express.Router();

// Supported file types
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

// Multer configuration for handling file uploads (in memory)
const storage = multer.memoryStorage(); // Store files in memory instead of disk
const uploadOptions = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = isValid ? null : new Error('Invalid image type');
        cb(uploadError, isValid);
    }
});

// GET all categories
router.get(`/`, async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res.status(500).json({ success: false, message: 'No categories found.' });
        }
        res.status(200).send(categoryList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching categories.' });
    }
});

// GET category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.status(200).send(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching category.' });
    }
});

// POST a new category with Cloudinary icon upload
router.post('/', uploadOptions.single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No image in the request.');
    }

    try {
        // Upload the category icon to Cloudinary
        const iconResult = await uploadImage(file.buffer, { folder: 'categories', resource_type: 'image' });
        const iconUrl = iconResult.secure_url;

        // Create the category with the Cloudinary URL
        const category = new Category({
            name: req.body.name,
            icon: iconUrl, // Icon URL from Cloudinary
            color: req.body.color,
        });

        const savedCategory = await category.save();
        if (!savedCategory) {
            return res.status(400).send('The category cannot be created!');
        }

        res.send(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating category.');
    }
});

// PUT update category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon || undefined, // Allow updating the icon URL directly
                color: req.body.color,
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }
        res.send(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating category.' });
    }
});

// DELETE category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found!' });
        }
        res.status(200).json({ success: true, message: 'The category is deleted!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while deleting category.' });
    }
});

module.exports = router;