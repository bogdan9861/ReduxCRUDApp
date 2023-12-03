import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import store from '../../store/index'
import { useHttp } from "../../hooks/http.hook";
import { v4 as uuidv4 } from 'uuid';
import { addHero } from "../../components/heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/FiltersSlice";

const HeroesAddForm = () => {

    const filters = selectAll(store.getState());
    const loadingStatus = useSelector(state => state.filters.filterLoadingStatus);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [elementValue, setElementValue] = useState('');

    const { request } = useHttp();
    const dispatch = useDispatch();

    const getData = () => {
        const formData = { id: uuidv4(), name, description, elementValue };

        request('http://localhost:3001/heroes', 'POST', JSON.stringify(formData))
            .then(res => dispatch(addHero(res)))
            .catch(e => console.log(e))
    }

    const renderElements = filters.length == 0 && (loadingStatus == 'idle' || loadingStatus !== 'error') ? null :
        filters.map(({ id, name, label }) => {
            if (label === 'Все') return;

            return (
                <option key={id} value={name}>{label}</option>
            )
        })

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={e => e.preventDefault()}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                    onChange={e => { setName(name => e.target.value) }}
                    value={name} />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    onChange={e => setDescription(description => e.target.value)}
                    value={description}
                    style={{ "height": '130px' }} />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    onChange={e => setElementValue(elementValue => e.target.value)}
                    name="element">
                    <option>Я владею элементом...</option>
                    {renderElements}
                </select>
            </div>

            <button type="submit" className="btn btn-primary" onClick={getData}>Создать</button>
        </form>
    )
}

export default HeroesAddForm;