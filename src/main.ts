import express from 'express'

import { db, firestore } from './database/firebase'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Bem vindo ao app!')
})

app.get('/posts', async (req, res) => {
  try {
    const posts = await firestore.getDocs(firestore.collection(db, 'posts'))

    const postsList = posts.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.send(postsList)
  } catch (e) {
    console.log(e)

    res.status(500).send(e)
  }
})

app.get('/posts/:id', async (req, res) => {
  const id = req.params.id

  try {
    const post = await firestore.getDoc(firestore.doc(db, 'posts', id))

    if (!post.exists()) {
      return res.status(404).send('Post não encontrado!')
    }

    res.send({
      id: post.id,
      ...post.data(),
    })
  } catch (e) {
    console.log(e)

    res.status(500).send(e)
  }
})

app.post('/posts', async (req, res) => {
  console.log(req.body)

  const title = req.body.title

  try {
    const docRef = await firestore.addDoc(firestore.collection(db, 'posts'), {
      title: title,
    })

    res.send(docRef.id)
  } catch (e) {
    console.log(e)

    res.status(500).send(e)
  }
})

app.put('/posts/:id', async (req, res) => {
  const id = req.params.id
  const title = req.body.title

  try {
    await firestore.updateDoc(firestore.doc(db, 'posts', id), {
      title: title,
    })

    res.send('Post atualizado com sucesso!')
  } catch (e) {
    console.log(e)

    res.status(500).send(e)
  }
})

app.delete('/posts/:id', async (req, res) => {
  const id = req.params.id

  try {
    await firestore.deleteDoc(firestore.doc(db, 'posts', id))

    res.send('Post excluído com sucesso!')
  } catch (e) {
    console.log(e)

    res.status(500).send(e)
  }
})

app.listen(3000, () => {
  console.log('Serviço iniciado em: http://localhost:3000')
})
