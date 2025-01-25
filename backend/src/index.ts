import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  console.log('Serving / route');
  return c.json({
    msg: "Hello Hono Not Worldb!"
  })

})

app.post ('api/v1/signup', (c) => {
  return c.json ({
    msg: "signed up"
  });
})

app.post ('api/v1/signin', (c) => {
  return c.json ({
    msg: "signed up"
  });
})

app.post ('api/v1/blog', (c) => {
  return c.json ({
    msg: "signed up"
  });
})

app.put  ('api/v1/blog', (c) => {
  return c.json ({
    msg: "signed up"
  });
})

app.get ('api/v1/blog/:id', (c) => {
  return c.json ({
    msg: "signed up"
  }); 
})

app.all('*', (c) => {
  console.log(`Unhandled request to: ${c.req.url}`); // This should log all other requests
  return c.text('This is a fallback route'); // This is just for debugging
});


// app.get ('api/v1/blog', (c) => {
//   return c.json ({
//     msg: "signed up"
//   });
// })
export default app
