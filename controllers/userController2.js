const express =require('express');
const db=require('../config/db')
const bcrypt=require('bcrypt')

const usertModel=require('../models/user.js')




const userController = {
    signup: (req, res) => {
        const today = new Date();
        const userData = {
         id:req.body.id,
         email: req.body.email,
         password: req.body.password,
         adresse: req.body.adresse,
         ville: req.nody.ville,
         point: req.nody.point,
         telephone: req.nody.telephone,
         name_prenom: req.body.name_prenom,
          created: today,
        };
    
        User.findOne({
          where: {
            email: req.body.email,
          },
        })
          .then((user) => {
            if (!user) {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData)
                  .then((user) => {
                    res.json({ status: user.email + 'Registered!' });
                  })
                  .catch((err) => {
                    res.send('error: ' + err);
                  });
              });
            } else {
              res.json({ error: 'User already exists' });
            }
          })
          .catch((err) => {
            res.send('error: ' + err);
          });
      }
}
  
let refreshTokens = [];
const UserController = {
  login: async (req, res) => {
    try {
      Model.user.findOne({ where: { email: req.body.email } }).then((User) => {
        if (User === null) {
          return res.status(404).json({err:"email is not correct"});
        } else {
          if (User.email_verifie === "verifie") {
            bcrypt.compare(req.body.password, User.password).then((isMatch) => {
              if (!isMatch) {
                return res.status(404).json({err:"password is not correct"});
              } else {
                var accessToken = jwt.sign(
                  {
                    id: User.id,
                    name_prenom: User.name_prenom,
                    role: User.role,
                  },
                  process.env.PRIVATE_KEY,
                  { expiresIn: "1h" }
                );
                var refreshToken = jwt.sign(
                  {
                    id: User.id,
                    name_prenom: User.name_prenom,
                    role: User.role,
                  },
                  process.env.REFRESH_KEY,
                  { expiresIn: "30d" }
                );
                refreshTokens.push(refreshToken);
                res.status(200).json({
                  message: "success",
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                });
              }
            });
          } else {
            return res.status(404).json({
              success: false,
              message: "verifie your email",
            });
          }
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  register: async (req, res) => {
    try {
      Model.user.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user !== null) {
          return res.status(400).json({err:"email exist"});
        } else {
          const passwordHash = bcrypt.hashSync(req.body.password, 10);
          const datauser = {
            email: req.body.email,
            password: passwordHash,
            name_prenom: req.body.name_prenom,
            email_verifie: "non_verifie",
            role: "client",
          };
          Model.user.create(datauser).then((user) => {
            if (user !== null) {
              let link = `http://localhost:5000/user/verif/${req.body.email}`;
                            sendMail.sendEmailVerification(req.body.email, link);
              res.status(200).json({
                success: true,
                user: datauser,
                message: "verif your email now ",
              });
            } else {
              res.status(400).json({
                success: false,
                error: "error lorsque la creation de user ",
              });
            }
          });
        }
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  emailVerification: async (req, res) => {
    try {
      Model.user
        .findOne({ where: { email: req.params.email } })
        .then(async (user) => {
          if (user !== null) {
            await Model.user
              .update(
                { email_verifie: "verifie" },
                {
                  where: {
                    email: req.params.email,
                  },
                }
              )
              .then((response) => {
                if (response != 0) {

                  res.redirect("http://localhost:0000/login");
                                } else {
                  res.status(404).json({
                    error: " error  lorque la update ",
                  });
                }
              });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  refresh: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.json({ message: "Refresh token not found" });
      }
      jwt.verify(refreshToken, process.env.REFRESH_KEY, (err, User) => {
        if (!err) {
          var accessToken = jwt.sign(
            {
              id: User.id,
              name_prenom: User.name_prenom,
              role: User.role,
            },
            process.env.PRIVATE_KEY,
            { expiresIn: "1h" }
          );
          return res.json({ success: true, accessToken });
        } else {
          return res.json({
            success: false,
            message: "Invalid refresh token",
          });
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  sendMailforgotPassword: async (req, res) => {
    try {
      Model.user
        .findOne({ where: { email: req.body.email } })
        .then((olduser) => {
          if (olduser === null) {
            return res.status(400).json({
              success: false,
              message: " user not exist",
            });
          } else {
            const secret = process.env.forget_key + olduser.password;
            const token = jwt.sign(
              { email: olduser.email, id: olduser.id },
              secret,
              {
                expiresIn: "5m",
              }
            );
            const link = `http://localhost:00000/reset-password/${olduser.id}/${token}`;            sendMail.sendEmailToForgetPassword(req.body.email, link);
            res.status(200).json({
              success: true,
              message: "check your inbox now",
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  forgotpassword: async (req, res) => {
    try {
      const { id, token } = req.params;
      const { password } = req.body;
      Model.user.findOne({ where: { id: id } }).then((olduser) => {
        if (olduser !== null) {
          const secret = process.env.forget_key + olduser.password;
          jwt.verify(token, secret, async (err, User) => {
            if (!err) {
              const newPassword = bcrypt.hashSync(password, 10);
              await Model.user
                .update(
                  { password: newPassword },
                  {
                    where: {
                      id: id,
                    },
                  }
                )
                .then((response) => {
                  if (response !== 0) {
                    return res.status(200).json({
                      success: true,
                      message: " forgot password Done",
                    });
                  }
                });
            } else {
              return res.status(400).json({
                success: false,
                message: "Invalid refresh token",
              });
            }
          });
        } else {
          return res.status(400).json({
            success: false,
            message: " user not exist",
          });
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  Contact: async (req, res) => {
    try {
      const { email, sujet, message, name } = req.body;
      sendMail.sendContactEmail(email, sujet, message, name)
      res.status(200).json({
        success: true,
        message: " message envoyer ",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
  authWithSocialMedia: async (req, res) => {
    try {
      const { email, name} = req.body;
        Model.user.findOne({ where: { email: email } }).then((user) => {
          if (user !== null) {
            var accessToken = jwt.sign(
              {
                id: user.id,
                name_prenom: user.name_prenom,
                role: user.role,
              },
              process.env.PRIVATE_KEY,
              { expiresIn: "1h" }
            );
            var refreshToken = jwt.sign(
              {
                id: user.id,
                name_prenom: user.name_prenom,
                role: user.role,
              },
              process.env.REFRESH_KEY,
              { expiresIn: "30d" }
            );
            refreshTokens.push(refreshToken);
            return res.status(200).json({
              message: "success login",
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          } else {
            const characters =
              "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let Password = "";
            for (let i = 0; i < 25; i++) {
              Password +=
                characters[Math.floor(Math.random() * characters.length)];
            }
            const passwordHash = bcrypt.hashSync(Password, 10);
            const datauser = {
              email: email,
              password: passwordHash,
              name_prenom: name,
              email_verifie: "verifie",
              role: "client",
            };
            Model.user.create(datauser).then((user) => {
              if (user !== null) {
                var accessToken = jwt.sign(
                  {
                    id: user.id,
                    name_prenom: user.name_prenom,
                    role: user.role,
                  },
                  process.env.PRIVATE_KEY,
                  { expiresIn: "1h" }
                );
                var refreshToken = jwt.sign(
                  {
                    id: user.id,
                    name_prenom: user.name_prenom,
                    role: user.role,
                  },
                  process.env.REFRESH_KEY,
                  { expiresIn: "30d" }
                );
                refreshTokens.push(refreshToken);
                return res.status(200).json({
                    message: "success create and login ",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                  });
              }
            });
          }
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
  },
};
export default userController
