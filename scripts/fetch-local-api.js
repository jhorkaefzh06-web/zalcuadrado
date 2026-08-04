async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const data = await res.json();
    console.log(`Total products returned: ${data.length}`);
    data.forEach(p => {
      console.log(`- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ${p.price}`);
    });
  } catch (err) {
    console.error(err);
  }
}
run();
