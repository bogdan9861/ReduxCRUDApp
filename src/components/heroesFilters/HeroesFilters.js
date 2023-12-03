import { useEffect, useState } from "react";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import store from "../../store";
import { addFilter, fetchFilters, selectAll } from "../../components/heroesFilters/FiltersSlice";
import { useHttp } from "../../hooks/http.hook";

const HeroesFilters = () => {

    const filters = selectAll(store.getState())
    const loadingStatus = useSelector(state => state.filters.filterLoadingStatus)

    const { request } = useHttp();
    const dispatch = useDispatch();

    useEffect(() => {
       dispatch(fetchFilters())
    }, [])

    const onFilterActive = (e, name) => {
        const allBtns = document.querySelectorAll('.btn');

        allBtns.forEach(el => {
            el.classList.remove('active', 'btn-outline-dark');
        })

        e.target.className += ' btn-outline-dark active';

        dispatch(addFilter(name))
    }

    const renderButtons = filters.length == 0 && (loadingStatus == 'idle' || loadingStatus !== 'error') ? null :
        filters.map(({id, name, label, className}) => {
            return (
                <button
                    key={id}
                    className={`btn ${className}`}
                    onClick={e => onFilterActive(e, name)}>
                    {label}
                </button>
            )
        })

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {renderButtons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;