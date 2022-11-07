import { generateItems } from '~/utils/helpers'

export const cardColors = [
  { id: 0, name: 'Red', color: '#fecaca' },
  { id: 1, name: 'Orange', color: '#fdba74' },
  { id: 2, name: 'Yellow', color: '#fef08a' },
  { id: 3, name: 'Green', color: '#86efac' },
  { id: 4, name: 'Blue', color: '#bfdbfe' },
  { id: 5, name: 'Pink', color: '#f9a8d4' },
  { id: 6, name: 'Purple', color: '#d8b4fe' }
]

const listName = [
  {
    name: 'Not Started',
    color: cardColors[0].color
  },
  {
    name: 'In progress',
    color: cardColors[2].color
  },
  {
    name: 'Completed',
    color: cardColors[3].color
  },
]

const defaultTask = [
  {
    title: 'Clean the kitchen',
    description:
      "Mop the floor, wipe the countertop and don't forget to take out the trash!"
  },
  {
    title: 'Call Mom',
    description: "It's her birthday!"
  },
  {
    title: 'Water flowers',
    description: 'They need water, or they will die.'
  }
]
export const state = () => ({
  list: JSON.parse(localStorage.getItem('list')) || {
    type: 'container',
    props: {
      orientation: 'horizontal'
    },
    children: generateItems(3, (i) => ({
      id: i,
      type: 'container',
      name: ` ${listName[i].name}`,
      props: {
        orientation: 'vertical',
        className: '',
        color: `${listName[i].color}`
      },
      children: generateItems(
        +((Math.random() * 10) % 4).toFixed() + 1,
        (j) => ({
          type: 'draggable',
          key: `${Math.random()}`.slice(2),
          title: `${defaultTask[j % 3].title} - ${j + 1}`,
          description: defaultTask[j % 3].description
        })
      )
    }))
  }
})

export const mutations = {
  newColumns(state, newColumns) {
    state.list.children = newColumns
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  spliceColumn(state, { start, deleteCount, item }) {
    if (item) {
      state.list.children.splice(start, deleteCount, item)
      localStorage.setItem('list', JSON.stringify(state.list))
    }
  },
  addCard(state, data) {
    state.list.children[data.colId].children.push({
      type: 'draggable',
      key: `${data.title}${data.colId}${length}`,
      title: data.title,
      description: data.desc
    })
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  addColumn(state, col) {
    const length = state.list.children.length
    state.list.children.push({
      id: length,
      type: 'container',
      name: col.name,
      props: {
        orientation: 'vertical',
        className: '',
        color: col.color
      },
      children: []
    })
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  editColumn(state, col) {
    const column = state.list.children.find((c) => c.id === col.colId)
    column.name = col.name
    column.props.color = col.color
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  updateCard(state, data) {
    const { cardKey, oldColId, colId, title, desc } = data
    let prevIndex
    const card = state.list.children[oldColId].children.find((i, idx) => {
      prevIndex = idx
      return i.key === cardKey
    })
    card.title = title
    card.description = desc
    if (oldColId !== colId) {
      state.list.children[oldColId].children.splice(prevIndex, 1)
      state.list.children[colId].children.push(card)
    }
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  deleteCard(state, { cardKey, colId }) {
    const prevIndex = state.list.children[colId].children.findIndex(
      (i) => i.key === cardKey
    )
    state.list.children[colId].children.splice(prevIndex, 1)
    localStorage.setItem('list', JSON.stringify(state.list))
  },
  deleteColumn(state, colId) {
    const prevIndex = state.list.children.findIndex((i) => i.id === colId)
    state.list.children.splice(prevIndex, 1)
    localStorage.setItem('list', JSON.stringify(state.list))
  }
}
