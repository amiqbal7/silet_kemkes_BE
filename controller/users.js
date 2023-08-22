const {
  Data
} = require('../model/schemas')

const getData = async (req, res) => {
  try {
    const data = await Data.findAll();

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
}

const updateData = async (req, res) => {
  try {
    const {
      Nama_data,
      Jumlah
    } = req.body
    await Users.update({
      Nama_data: Nama_data,
      Jumlah: Jumlah,
    }, {
      where: {
        id: req.param.id
      }
    })
    res.status(201).json({
      success: true,
      message: 'Data updated successfully!',
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

module.exports = {
  getData,
  updateData
}



// app.put("/update/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = "UPDATE data SET `Nama_data` =?, `Jumlah` =? WHERE id =?"

//   db.query(
//     sql,
//     [req.body.Nama_data, req.body.Jumlah, id],
//     (err, result) => {
//       if (err) return res.json("err");
//       return res.json({
//         updated: true
//       })
//     }
//   );
// });