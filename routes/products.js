// const {Product} = require('../models/product');
// const express = require('express');
// const { Category } = require('../models/category');
// const router = express.Router();
// const mongoose = require('mongoose');
// const multer = require('multer');
// // var _config  = require("./config");
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
//     let filter = {};
//     if(req.query.categories)
//     {
//          filter = {category: req.query.categories.split(',')}
//     }

//     const productList = await Product.find(filter).populate('category');

//     if(!productList) {
//         res.status(500).json({success: false})
//     } 
//     res.send(productList);
// })

// router.get(`/:id`, async (req, res) =>{
//     const product = await Product.findById(req.params.id).populate('category');

//     if(!product) {
//         res.status(500).json({success: false})
//     } 
//     res.send(product);
// })
// // Making the post way for the image and whole form 
// router.post(`/`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
//     // const category = await Category.findById(req.body.category);
//     // if(!category) return res.status(400).send('Invalid Category');

//     const file = req.files['image'] ? req.files['image'][0] : null;
//     const files = req.files['images'];

//     if(!file) return res.status(400).send('No main image in the request');

//     const fileName = file.filename;
//     const basePath = `${req.protocol}://${req.get('host')}/tmp/uploads/`;

//     // Create image paths for gallery images
//     let imagesPaths = [];
//     if (files) {
//         files.map(file => {
//             imagesPaths.push(`${basePath}${file.filename}`);
//         });
//     }

//     let product = new Product({
//         name: req.body.name,
//         description: req.body.description,
//         richDescription: req.body.richDescription,
//         image: `${basePath}${fileName}`, // Main image
//         images: imagesPaths, // Gallery images
//         brand: req.body.brand,
//         price: req.body.price,
//         category: req.body.category,
//         countInStock: req.body.countInStock,
//         rating: req.body.rating,
//         numReviews: req.body.numReviews,
//         isFeatured: req.body.isFeatured,
//     });

//     product = await product.save();

//     if (!product)
//         return res.status(500).send('The product cannot be created');

//     res.send(product);
// });

// router.put('/:id',async (req, res)=> {
//     if(!mongoose.isValidObjectId(req.params.id)) {
//        return res.status(400).send('Invalid Product Id')
//     }
//     // const category = await Category.findById(req.body.category);
//     // if(!category) return res.status(400).send('Invalid Category')

//     const product = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image: req.body.image,
//             brand: req.body.brand,
//             price: req.body.price,
//             discount:req.body.discount,
//             category: req.body.category,
//             countInStock: req.body.countInStock,
//             rating: req.body.rating,
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured,
//         },
//         { new: true}
//     )

//     if(!product)
//     return res.status(500).send('the product cannot be updated!')

//     res.send(product);
// })

// router.delete('/:id', (req, res)=>{
//     Product.findByIdAndRemove(req.params.id).then(product =>{
//         if(product) {
//             return res.status(200).json({success: true, message: 'the product is deleted!'})
//         } else {
//             return res.status(404).json({success: false , message: "product not found!"})
//         }
//     }).catch(err=>{
//        return res.status(500).json({success: false, error: err}) 
//     })
// })

// router.get(`/get/count`, async (req, res) =>{
//     const productCount = await Product.countDocuments((count) => count)

//     if(!productCount) {
//         res.status(500).json({success: false})
//     } 
//     res.send({
//         productCount: productCount
//     });
// })

// router.get(`/get/featured/:count`, async (req, res) =>{
//     const count = req.params.count ? req.params.count : 0
//     const products = await Product.find({isFeatured: true}).limit(+count);

//     if(!products) {
//         res.status(500).json({success: false})
//     } 
//     res.send(products);
// })

// router.put(
//     '/gallery-images/:id', 
//     uploadOptions.array('images', 10), 
//     async (req, res)=> {
//         if(!mongoose.isValidObjectId(req.params.id)) {
//             return res.status(400).send('Invalid Product Id')
//          }
//          const files = req.files
//          let imagesPaths = [];
//          const basePath = `${req.protocol}://${req.get('host')}/tmp/uploads/`;

//          if(files) {
//             files.map(file =>{
//                 imagesPaths.push(`${basePath}${file.filename}`);
//             })
//          }

//          const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: imagesPaths
//             },
//             { new: true}
//         )

//         if(!product)
//             return res.status(500).send('the gallery cannot be updated!')

//         res.send(product);
//     }
// )

// module.exports =router;








// ..........................................................................................................








// const express = require('express');
// const { Product } = require('../models/product');
// const { Category } = require('../models/category');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { uploadImage } = require('../services/cloudinaryConfig'); // Import Cloudinary upload function

// const router = express.Router();

// // Multer configuration for handling file uploads
// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('Invalid image type');
//         if (isValid) {
//             uploadError = null;
//         }
//         cb(uploadError, '/tmp/uploads'); // Temporary storage for files
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`);
//     }
// });

// const uploadOptions = multer({ storage: storage });

// // GET all products
// router.get(`/`, async (req, res) => {
//     let filter = {};
//     if (req.query.categories) {
//         filter = { category: req.query.categories.split(',') };
//     }
//     const productList = await Product.find(filter).populate('category');
//     if (!productList) {
//         return res.status(500).json({ success: false });
//     }
//     res.send(productList);
// });

// // GET product by ID
// router.get(`/:id`, async (req, res) => {
//     const product = await Product.findById(req.params.id).populate('category');
//     if (!product) {
//         return res.status(500).json({ success: false });
//     }
//     res.send(product);
// });

// // POST a new product with Cloudinary image upload
// router.post(`/`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
//     const file = req.files['image'] ? req.files['image'][0] : null;
//     const files = req.files['images'];

//     if (!file) {
//         return res.status(400).send('No main image in the request');
//     }

//     try {
//         // Upload main image to Cloudinary
//         const mainImageResult = await uploadImage(file.path, { folder: 'products' });
//         const mainImageUrl = mainImageResult.secure_url;

//         // Upload gallery images to Cloudinary
//         let galleryImagesUrls = [];
//         if (files) {
//             for (const file of files) {
//                 const galleryImageResult = await uploadImage(file.path, { folder: 'products/gallery' });
//                 galleryImagesUrls.push(galleryImageResult.secure_url);
//             }
//         }

//         // Create the product with Cloudinary URLs
//         const product = new Product({
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image: mainImageUrl, // Main image URL from Cloudinary
//             images: galleryImagesUrls, // Gallery image URLs from Cloudinary
//             brand: req.body.brand,
//             price: req.body.price,
//             category: req.body.category,
//             countInStock: req.body.countInStock,
//             rating: req.body.rating,
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured,
//         });

//         const savedProduct = await product.save();
//         if (!savedProduct) {
//             return res.status(500).send('The product cannot be created');
//         }
//         res.send(savedProduct);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error creating product');
//     }
// });

// // PUT update product
// router.put('/:id', async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('Invalid Product Id');
//     }

//     const product = await Product.findByIdAndUpdate(
//         req.params.id,
//         {
//             name: req.body.name,
//             description: req.body.description,
//             richDescription: req.body.richDescription,
//             image: req.body.image,
//             brand: req.body.brand,
//             price: req.body.price,
//             discount: req.body.discount,
//             category: req.body.category,
//             countInStock: req.body.countInStock,
//             rating: req.body.rating,
//             numReviews: req.body.numReviews,
//             isFeatured: req.body.isFeatured,
//         },
//         { new: true }
//     );

//     if (!product) {
//         return res.status(500).send('The product cannot be updated!');
//     }
//     res.send(product);
// });

// // DELETE product
// router.delete('/:id', (req, res) => {
//     Product.findByIdAndRemove(req.params.id)
//         .then(product => {
//             if (product) {
//                 return res.status(200).json({ success: true, message: 'The product is deleted!' });
//             } else {
//                 return res.status(404).json({ success: false, message: 'Product not found!' });
//             }
//         })
//         .catch(err => {
//             return res.status(500).json({ success: false, error: err });
//         });
// });

// // GET product count
// router.get(`/get/count`, async (req, res) => {
//     const productCount = await Product.countDocuments((count) => count);
//     if (!productCount) {
//         return res.status(500).json({ success: false });
//     }
//     res.send({ productCount: productCount });
// });

// // GET featured products
// router.get(`/get/featured/:count`, async (req, res) => {
//     const count = req.params.count ? req.params.count : 0;
//     const products = await Product.find({ isFeatured: true }).limit(+count);
//     if (!products) {
//         return res.status(500).json({ success: false });
//     }
//     res.send(products);
// });

// // PUT update gallery images
// router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//         return res.status(400).send('Invalid Product Id');
//     }

//     const files = req.files;
//     let galleryImagesUrls = [];

//     try {
//         if (files) {
//             for (const file of files) {
//                 const galleryImageResult = await uploadImage(file.path, { folder: 'products/gallery' });
//                 galleryImagesUrls.push(galleryImageResult.secure_url);
//             }
//         }

//         const product = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 images: galleryImagesUrls,
//             },
//             { new: true }
//         );

//         if (!product) {
//             return res.status(500).send('The gallery cannot be updated!');
//         }
//         res.send(product);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error updating gallery images');
//     }
// });

// module.exports = router;





// ..................................................................................................................................................

























const express = require('express');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinaryConfig'); // Import Cloudinary upload function

const router = express.Router();

// Multer configuration for handling file uploads (in memory)
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.memoryStorage(); // Store files in memory instead of disk
const uploadOptions = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = isValid ? null : new Error('Invalid image type');
        cb(uploadError, isValid);
    }
});

// GET all products
router.get(`/`, async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }
    try {
        const productList = await Product.find(filter).populate('category');
        if (!productList) {
            return res.status(500).json({ success: false, message: 'No products found.' });
        }
        res.send(productList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching products.' });
    }
});

// GET product by ID
router.get(`/:id`, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }
        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching product.' });
    }
});

// POST a new product with Cloudinary image upload
router.post(`/`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    const file = req.files['image'] ? req.files['image'][0] : null;
    const files = req.files['images'];

    if (!file) {
        return res.status(400).send('No main image in the request.');
    }

    try {
        // Upload main image to Cloudinary
        const mainImageResult = await uploadImage(file.buffer, { folder: 'products', resource_type: 'image' });
        const mainImageUrl = mainImageResult.secure_url;

        // Upload gallery images to Cloudinary
        let galleryImagesUrls = [];
        if (files) {
            for (const file of files) {
                const galleryImageResult = await uploadImage(file.buffer, { folder: 'products/gallery', resource_type: 'image' });
                galleryImagesUrls.push(galleryImageResult.secure_url);
            }
        }

        // Create the product with Cloudinary URLs
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: mainImageUrl, // Main image URL from Cloudinary
            images: galleryImagesUrls, // Gallery image URLs from Cloudinary
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        });

        const savedProduct = await product.save();
        if (!savedProduct) {
            return res.status(500).send('The product cannot be created.');
        }
        res.send(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating product.');
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id.');
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                discount: req.body.discount,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The product cannot be updated!');
        }
        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating product.' });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndRemove(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
        res.status(200).json({ success: true, message: 'The product is deleted!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while deleting product.' });
    }
});

// GET product count
router.get(`/get/count`, async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        if (!productCount) {
            return res.status(500).json({ success: false, message: 'No products found.' });
        }
        res.send({ productCount: productCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching product count.' });
    }
});

// GET featured products
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    try {
        const products = await Product.find({ isFeatured: true }).limit(+count);
        if (!products) {
            return res.status(500).json({ success: false, message: 'No featured products found.' });
        }
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching featured products.' });
    }
});

// PUT update gallery images
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id.');
    }

    const files = req.files;

    try {
        let galleryImagesUrls = [];
        if (files) {
            for (const file of files) {
                const galleryImageResult = await uploadImage(file.buffer, { folder: 'products/gallery', resource_type: 'image' });
                galleryImagesUrls.push(galleryImageResult.secure_url);
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: galleryImagesUrls,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).send('The gallery cannot be updated!');
        }
        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating gallery images.');
    }
});

module.exports = router;