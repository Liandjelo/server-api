const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');
const cors = require('cors');
const fs = require('fs');

app.use(cors());

app.use(express.json());

app.post('/bad-api', (req, res) => {
    const { email, path: userPath } = req.body;
    if (userPath === '/settings/user-account') {
        fs.readFile(path.join(__dirname, 'user.json'), (error, data) => {
            if (error) {
                return res.status(500).send('Error occurred while sending the file.');
            }
            const users = JSON.parse(data);
            const user = users.find((user) => user.email === email);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ error: 'User not found with provided email.' });
            }
        });
    } else {
        return res.status(400).json({ error: "Invalid path." });
    }
});

const checkUid = (uid, email) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf-8");
        const users = JSON.parse(data);
        return users.find((user) => user.uid === uid && user.email === email);
    } catch (err) {
        console.error("Error reading user.json:", err);
        return null;
    }
};
app.get("/", (req, res) => {
    res.send("Hello World! This is a sample web server.");
});
app.post("/good-api", (req, res) => {
    const { email, path: userPath, uid } = req.body;
    if (uid && checkUid(uid, email)) {
        if (userPath === "/settings/user-account") {
            try {
                const data = fs.readFileSync(path.join(__dirname, "user.json"), "utf-8");
                const users = JSON.parse(data);
                const user = users.find((user) => user.uid === uid && user.email === email);
                if (user) {
                    return res.status(200).json(user);
                } else {
                    return res.status(404).json({ error: "User not found with provided email." });
                }
            } catch (err) {
                return res.status(500).send("Error occurred while reading the file.");
            }
        } else {
            return res.status(400).json({ error: "Invalid path." });
        }
    } else {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Authentication is required to access this resource.",
        });
    }
});
app.listen(PORT, () => {
    console.log("Server is running at port ", PORT);
})
