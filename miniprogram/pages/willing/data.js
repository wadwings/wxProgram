function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
let product = new Array();
let color = ["#3be8b0", "#1aafd0", "#6a67ce", "#ffb900", "#fc636b", "#050f2c", "#003666", "#00aeff", "#3369e7", "#8e43e7", "#b84592", "#ff4f81", "#ff6c5f", "#ffc168", "#2dde98", "#1cc7d0"]
color = shuffle(color);
wx.cloud.database().collection('article').where({ genre: "willing" }).get().then(res => {
  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i].enable)
      product.push({
        src: res.data[i].src,
        color: color[i % 16],
        html: res.data[i].html,
        shetuan: res.data[i].shetuan
      })
    product = shuffle(product);
    for (let i = 0; i < product.length; i++)
      product[i].index = i;
    console.log(product);
  }
})
export {
  product
};