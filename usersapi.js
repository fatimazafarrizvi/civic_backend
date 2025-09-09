const User = require('../Models/user');

const insert_user = async (req, res) => {
    try {
        const { name, username, email, phoneNumber, age, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with the same email or username"
            });
        }

        const user = new User({
            name,
            username,
            email,
            phoneNumber,
            age,
            password
        });

        const savedUser = await user.save();
        console.log('User inserted successfully');
        res.status(201).json(savedUser);
    } catch (error) {
        console.log('Insert User Error:', error);
        res.status(400).json(error);
    }
};


const userfind = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).exec();

        if (user) {
            if (user.password === password) {
                console.log('Auth Success');
                res.json({ auth: 'success' });
            } else {
                console.log('Auth Failed - Incorrect Password');
                res.json({ auth: 'failed', message: 'Incorrect password' });
            }
        } else {
            console.log('Auth Failed - User Not Found');
            res.json({ auth: 'failed', message: 'User not found' });
        }
    } catch (error) {
        console.log('Fetch error :-', error);
        res.status(500).json({ message: 'An error occurred during authentication', error });
    }
};

module.exports = {
    userfind,
    insert_user
};
