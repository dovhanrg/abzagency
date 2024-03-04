import {Request, Response} from "express";

const postUsers = (req: Request, res: Response) => {

};

export default postUsers;

// app.get('/users', async (req, res, next) => {
//     // console.log(req.headers);
//     // console.log(req.body);
//     res.send({hello: 'world'});
//
//     const user = new User();
//     user.first_name = "Roman";
//     user.last_name = "Dovhan";
//     user.city = "Kyiv";
//     user.country = "Ukraine";
//     user.email = "dovhan@duck.com";
//     user.password = "12345";
//     user.created_at = new Date().toISOString();
//     user.image_file_name = randomUUID();
//
//
//     await AppDataSource.manager.save(user);
//     console.log('user"s been saved: ', user);
//
//     res.json({success: true});
// });
