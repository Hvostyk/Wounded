import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, type InputRef } from "antd";
import { useEffect, useRef, useState } from "react";
import { clearFilters, setSearch } from "../../../app/filterSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./style.scss";

export const FilterBar = () => {
    const dispatch = useAppDispatch();
    const search = useAppSelector(state => state.filter.search);
    const [isOpen, setIsOpen] = useState(!!search);
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (search) setIsOpen(true);
    }, [search]);

    const open = () => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 30);
    };

    const close = () => {
        if (!search) setIsOpen(false);
    };

    const clear = () => {
        dispatch(clearFilters());
        setIsOpen(false);
    };

    return (
        <div className={`search-bar${isOpen ? " search-bar--open" : ""}`} onKeyDown={e => e.key === "Escape" && clear()}>
            <button className="search-bar__icon" onClick={open} tabIndex={isOpen ? -1 : 0}>
                <SearchOutlined />
            </button>
            <Input
                ref={inputRef}
                placeholder="Поиск по названию, артисту, альбому..."
                value={search}
                onChange={e => dispatch(setSearch(e.target.value))}
                onBlur={close}
                variant="borderless"
                className="search-bar__input"
            />
            {search && (
                <button className="search-bar__clear" onMouseDown={e => e.preventDefault()} onClick={clear}>
                    <CloseOutlined />
                </button>
            )}
        </div>
    );
};
