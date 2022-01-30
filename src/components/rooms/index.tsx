import React, { FC, useEffect, useState } from 'react'
type TChildren = {
    name: string
    age: number
}
type TRoom = {
    name: string
    adults: number
    children: TChildren[]
}
type ModalProps = {
    onClose: () => void
    show: boolean
}
const Modal: FC<ModalProps> = ({ onClose, show, children }) => {
    return (
        <div className={`modal ${show ? 'show' : ''}`} onClick={onClose}>
            <div className='modalContent' onClick={e => e.stopPropagation()}>
                <div className='modalHeader'>
                    <button onClick={onClose} >X</button> Who is staying?
                </div>
                <div className='modalBody'>
                    {children}
                </div>
            </div>
        </div>
    )
}

const Rooms = (props: {
    rooms: TRoom[],
    updateAdults: (value: 'increment' | 'decrement', roomName: string) => void
    updateChildren: (value: 'increment' | 'decrement', roomName: string) => void
    updateChildrenAge: (value: string, childName: string, roomName: string) => void
    removeChild: (childName: string, roomName: string) => void
    removeRoom: (roomName: string) => void
    addRoom: () => void
}) => {
    return (
        <div>
            {console.log("in rooms", props.rooms)}
            <button onClick={() => props.addRoom()}>Add Room</button>
            {props.rooms.map(room => {
                console.log("creating", room);
                return <div key={room.name}>
                    {room.name}
                    <div>
                        <div>
                            Adults
                        </div>
                        <div>
                            <button onClick={() => props.updateAdults('increment', room.name)}>+</button>
                            {room.adults}
                            <button onClick={() => props.updateAdults('decrement', room.name)}>-</button>
                        </div>
                    </div>
                    <div>
                        <div>
                            Children
                        </div>
                        <div>
                            <button onClick={() => props.updateChildren('increment', room.name)}>+</button>
                            {room.children.length}
                            <button onClick={() => props.updateChildren('decrement', room.name)}>-</button>
                        </div>
                    </div>
                    <div>
                        {room.children.length > 0 ?
                            room.children.map((child) => {
                                return (<div key={child.name}>
                                    {child.name}
                                    <select placeholder='Age' value={child.age}
                                        onChange={(e) => props.updateChildrenAge(e.target.value, child.name, room.name)}>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                    <button onClick={() => props.removeChild(child.name, room.name)}>Remove</button>
                                </div>)
                            })
                            : null
                        }
                    </div>
                    <button onClick={() => props.removeRoom(room.name)}>Remove room</button>
                </div>
            })}
        </div>
    )
}

const Search = () => {
    const [query, setQuery] = useState("2")
    const [inputValue, setInput] = useState("")
    const [rooms, setRooms] = useState<TRoom[]>([])
    const [show, setShow] = useState<boolean>(false)
    const parseRoom = (room: string, index: number) => {
        let newRoom: TRoom = {
            name: `Room ${index}`,
            adults: 0,
            children: []
        }
        var adultChildren = room.split(":")
        if (adultChildren.length === 1) {
            newRoom.adults = Number(adultChildren[0])
            return newRoom
        }
        if (adultChildren.length > 1) {
            newRoom.adults = Number(adultChildren[0])
            let children = adultChildren[1].split(",")
            let newChildren = children.map((child, index) => {
                return {
                    name: `child ${index}`,
                    age: Number(child)
                } as TChildren
            })
            newRoom.children = newChildren
            return newRoom
        }
    }
    const parser = (value: string) => {
        const rooms = value.split("|")
        let roomValues: TRoom[] = []
        rooms.map((room, index) => {
            let newRoom = parseRoom(room, index)
            if (newRoom !== undefined) {
                return roomValues.push(newRoom)
            }
        })
        return roomValues
    }
    const addRoom = () => {
        let newRoom: TRoom = {
            name: `Room ${rooms?.length}`,
            adults: 1,
            children: []
        }
        console.log(newRoom);
        console.log("Prev rooms", rooms);
        // rooms?.push(newRoom)
        setRooms((old) => [...old, newRoom])
    }
    const updateAdults = (value: 'increment' | 'decrement', roomName: string) => {
        console.log('updateAdults', value, roomName);

        var roomMap = Object.assign({}, ...rooms.map(room => { return { [room.name]: room } })) as { [x: string]: TRoom }
        if (value === 'increment') {
            roomMap[roomName].adults++
        } else if (value === 'decrement') {
            roomMap[roomName].adults--
        }
        setRooms(Object.values(roomMap))
    }
    const updateChildren = (value: 'increment' | 'decrement', roomName: string) => {
        console.log('updateAdults', value, roomName);

        var roomMap = Object.assign({}, ...rooms.map(room => { return { [room.name]: room } })) as { [x: string]: TRoom }
        if (value === 'increment') {
            roomMap[roomName].children.push({
                name: `child ${roomMap[roomName].children.length}`,
                age: 0
            })
        } else if (value === 'decrement') {
            roomMap[roomName].children.pop()
        }
        setRooms(Object.values(roomMap))
    }
    const updateChildrenAge = (value: string, childName: string, roomName: string) => {
        var roomMap = Object.assign({}, ...rooms.map(room => { return { [room.name]: room } })) as { [x: string]: TRoom }
        var children = Object.assign({}, ...roomMap[roomName].children.map(child => {
            if (child.name === childName) {
                child.age = Number(value)
            }
            return { [child.name]: child }
        })) as { [x: string]: TChildren }
        roomMap[roomName].children = Object.values(children)
        setRooms(Object.values(roomMap))
    }
    const removeChild = (childName: string, roomName: string) => {
        var roomMap = Object.assign({}, ...rooms.map(room => { return { [room.name]: room } })) as { [x: string]: TRoom }
        var updatedChildren: TChildren[] = []
        roomMap[roomName].children.map((child) => {
            if (child.name !== childName) {
                updatedChildren.push(child)
            }
        })
        roomMap[roomName].children = updatedChildren
        setRooms(Object.values(roomMap))
    }
    const removeRoom = (roomName: string) => {
        var updateRooms: TRoom[] = []
        rooms.map(room => {
            if (room.name !== roomName) {
                updateRooms.push(room)
            }
        })
        setRooms(updateRooms)
    }
    const setSearchQuery = (value: string) => {
        setQuery(value)
        setShow(true)
    }

    const onModalClose = () => {
        setShow(false)
    }
    useEffect(() => {
        console.log("reset");

        let newRooms = parser(query)
        console.log('start', newRooms);

        if (newRooms !== undefined) {
            console.log('newrooms start', newRooms);
            // rooms?.push(...newRooms)
            setRooms(newRooms)
        }
    }, [])
    useEffect(() => {
        let newRooms = parser(query)
        if (newRooms !== undefined) {
            rooms?.push(...newRooms)
            setRooms(rooms)
        }
    }, [query])
    return (
        <div>
            <input type={'text'} onChange={(e) => setInput(e.target.value)}></input>
            <button onClick={() => setSearchQuery(inputValue)}>Search</button>
            {console.log("render", rooms)}
            <Modal onClose={onModalClose} show={show} >
                {rooms.length > 0 ? <Rooms
                    rooms={rooms}
                    updateAdults={updateAdults}
                    updateChildren={updateChildren}
                    updateChildrenAge={updateChildrenAge}
                    removeChild={removeChild}
                    removeRoom={removeRoom}
                    addRoom={addRoom}
                /> : null}
            </Modal>
        </div>
    )
}

export default Search

/**
 * Reference   :https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a
 */