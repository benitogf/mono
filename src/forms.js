import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Switch from '@mui/material/Switch'
import { Divider } from '@mui/material'
import { Fragment } from 'react'
import _ from 'lodash'

export const formatCountString = (v) => {
    const vA = Math.abs(v)
    if (!Number.isFinite(vA) || Number.isNaN(vA)) return '0'
    const noDeciStr = !String(vA).includes('.') ? String(vA) : String(vA).slice(0, String(vA).lastIndexOf('.'))
    const numberCommas = () => {
        const chunkString = (str, length) => str.match(new RegExp('.{1,' + length + '}', 'g'))
        const reversed = noDeciStr.split('').reverse().join('')
        return String(chunkString(reversed, 3)).split('').reverse().join('')
    }
    const decimals = () => (!String(vA).includes('.') ? '' : String(vA).slice(String(vA).lastIndexOf('.')))
    return v >= 0 ? '' + numberCommas() + decimals() : '-' + numberCommas() + decimals()
}

// https://stackoverflow.com/a/14810722
export const objectMap = (obj, fn) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    )

export const getVal = (object, path) =>
    path.split('.').reduce((res, prop) => res[prop], object)

export const includesAll = (array, target) =>
    target.every(element => array.includes(element))

const _isField = (e) => {
    const k = Object.keys(e)
    return includesAll(k, ['set', 'error', 'value'])
}

const _isFieldValidate = (e) => {
    const k = Object.keys(e)
    return includesAll(k, ['error'])
}

const extractField = (e) => {
    switch (e.type) {
        case 'text':
            return e.value.trim()
        case 'number':
            return Number(e.value)
        case 'numberPayout':
            return Number(e.value)
        case 'bool':
            return !!e.value
        case 'radioBool':
            return !!e.value
        default:
            return e.value
    }
}

export const getFieldsValues = (fields) => objectMap(fields, (i => _isField(i) ? extractField(i) : getFieldsValues(i)))

const __validate = function (key) {
    if (_isFieldValidate(this.fields[key])) {
        if (this.fields[key].error()) {
            this.errors[key] = this.fields[key].message
        }
        return
    }

    this.errors = _.merge(this.errors, _validate(this.fields[key], this.errors))
}

const _validate = (fields, errors = {}) => {
    const bound = __validate.bind({
        errors,
        fields
    })
    Object.keys(fields).forEach(bound)

    return errors
}

export const validate = (fields, errors = {}) => {
    const bound = __validate.bind({
        errors,
        fields
    })
    Object.keys(fields).forEach(bound)

    return {
        errors,
        error: Object.keys(errors).length > 0,
    }
}

export const setDefaults = (fields, defaults) => {
    Object.keys(fields).forEach((key) => {
        if (_isField(fields[key])) {
            fields[key].set(defaults[key])
            return
        }

        setDefaults(fields[key], defaults[key])
    })
}

// export const clear = (fields) => Object.keys(fields).forEach((key) => fields[key].set(''))

const filterPaths = (basePath, paths) =>
    paths.map(p => p.indexOf(basePath) === 0 ? p.replace(basePath + '.', '') : '')

export const update = (fields, editing, newData, defaults) => {
    Object.keys(fields).forEach((key) => {
        if (_isField(fields[key])) {
            if (editing.indexOf(key) < 0) {
                const fieldData = newData[key] !== undefined ? newData[key] : defaults[key]
                fields[key].set(fieldData)
            }
            return
        }

        update(fields[key], filterPaths(key, editing), newData[key], defaults[key])
    })
}

export const regex = {
    username: RegExp(/^[a-zA-Z0-9_]{2,15}$/),
    email: RegExp(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/
    ),
    phone: RegExp(/^[0-9_-]{6,15}$/),
}

export const empty = { updated: -1, data: {}, created: 0 }

export const ItemSelect = ({ items, value, setValue, disabled }) => {
    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
        PaperProps: {
            style: {
                colorScheme: 'dark',
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }
    return <Select
        // id={name}
        // inputProps={{
        //     name,
        //     id: name,
        // }}
        required
        fullWidth
        onChange={(e) => {
            setValue(e.target.value)
        }}
        value={value}
        disabled={!!disabled && disabled()}
        size='small'
        MenuProps={MenuProps}
    >
        {items.map((item, index) => {
            const haveMeta = !!item.index && !!item.data
            return (
                <MenuItem key={'select-item' + index} value={haveMeta ? item.index : item}>
                    {haveMeta ? item.data.name : item}
                </MenuItem>
            )
        })}
    </Select>
}

const IFieldsForm = ({
    fields,
    group,
    changed,
    setChanged,
    loading,
    submitted
}) =>
    Object.keys(fields).map(fieldKey => {
        const field = fields[fieldKey]
        switch (field.type) {
            case 'text':
                return <Box key={fieldKey} display='flex' alignItems='center' gap='1rem' justifyContent='space-between'>
                    <Typography style={{ color: '#c4c4c4' }}>{field.label}: </Typography>
                    <TextField
                        sx={{
                            colorScheme: 'dark',
                        }}
                        width='20%'
                        margin='dense'
                        size='small'
                        id={fieldKey}
                        name={fieldKey}
                        type={'text'}
                        inputProps={{
                            step: '0.5',
                        }}
                        variant='outlined'
                        onChange={(e) => {
                            field.set(e.target.value)
                            setChanged(changed + 1)
                        }}
                        value={field.value}
                        disabled={loading || (field.disabled && field.disabled())}
                        error={submitted && field.error()}
                    />
                </Box>
            case 'bool':
                return <Box key={fieldKey} display='flex' alignItems='center' justifyContent='space-between'>
                    <Typography style={{ color: '#c4c4c4' }}>
                        {field.label}
                    </Typography>
                    <FormControlLabel
                        sx={{ margin: 0 }}
                        value={field.label}
                        disabled={loading || (field.disabled && field.disabled())}
                        control={
                            <Switch
                                checked={field.value}
                                disabled={loading}
                                onChange={(e) => {
                                    field.set(e.target.checked)
                                    setChanged(changed + 1)
                                }}
                            />
                        }
                    />
                </Box>
            case 'number':
                return <Box key={fieldKey} display='flex' alignItems='center' justifyContent='space-between' gap='1rem' width='100%'>
                    <Typography style={{ color: '#c4c4c4' }}>{field.label}:</Typography>
                    <TextField
                        sx={{
                            colorScheme: 'dark',
                        }}
                        width='20%'
                        margin='dense'
                        size='small'
                        id={fieldKey}
                        name={fieldKey}
                        type={'text'}
                        inputProps={{
                            step: '0.5',
                        }}
                        variant='outlined'
                        onChange={(e) => {
                            field.set(e.target.value.replace(/\D/g, ''))
                            setChanged(changed + 1)
                        }}
                        value={formatCountString(field.value)}
                        disabled={loading || (field.disabled && field.disabled())}
                        error={submitted && field.error()}
                    />
                </Box>
            case 'radioBool':
                return <FormControl key={fieldKey}>
                    <Typography style={{ color: '#c4c4c4' }}>
                        {field.label}
                    </Typography>
                    <RadioGroup
                        value={field.value}
                        disabled={loading || (field.disabled && field.disabled())}
                        onChange={(e) => {
                            const value = e.target.value === 'false' ? false : true
                            field.set(value)
                            setChanged(changed + 1)
                        }}
                    >
                        <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label={field.labelFalse}
                            disabled={loading}
                            style={{ marginLeft: 1 }}
                        />
                        <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label={field.labelTrue}
                            disabled={loading}
                            style={{ marginLeft: 1 }}
                        />
                    </RadioGroup>
                </FormControl>
            case 'select':
                return <Box key={fieldKey} display='flex' alignItems='center' gap='1rem' justifyContent='space-between'>
                    <Typography style={{ color: '#c4c4c4' }}>
                        {field.label}:
                    </Typography>
                    <ItemSelect
                        value={field.value}
                        setValue={field.set}
                        label={field.label}
                        items={field.items}
                        disabled={field.disabled} />
                </Box>
            default:
                return <p>Unknown Field Type: {fieldKey}-{field.type}</p>
        }
    })

export const FieldsForm = (props) => {
    const {
        fields,
        groups = {} } = props

    let _groups = {
        ...groups,
        none: {},
    }

    return <Box>
        <Box display='flex' gap='1em'>
            <Box width='100%'>
                <Box
                    style={{
                        width: 'fit-content',
                        padding: 25,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1em',
                        // border: '2px solid #666',
                        borderRadius: 10,
                    }}
                >
                    {Object.keys(_groups).map(groupKey => {

                        const group = _groups[groupKey]
                        const groupFields = Object.keys(fields).reduce((r, e) => {
                            if ((!fields[e].group && groupKey === 'none') || fields[e].group === groupKey) {
                                r[e] = fields[e]
                            }
                            return r;
                        }, {})

                        const validGroup = Object.keys(groupFields).length > 0
                        const dividerTop = validGroup && group.dividerTop
                        const dividerBottom = validGroup && group.dividerBottom

                        switch (group.type) {
                            case 'horizontal':
                                return <Fragment key={groupKey}>
                                    {dividerTop && <Divider />}
                                    {validGroup && <Typography>{_groups[groupKey].label}</Typography>}
                                    {validGroup && <Box style={{
                                        flexDirection: 'row',
                                        gap: '1.5em',
                                    }} display='flex' gap='1em'>
                                        <IFieldsForm {...props} fields={groupFields} />
                                    </Box>}
                                    {dividerBottom && <Divider />}
                                </Fragment>
                            default:
                                return <Fragment key={groupKey}>
                                    {dividerTop && <Divider />}
                                    {validGroup && <Typography>{_groups[groupKey].label}</Typography>}
                                    <IFieldsForm {...props} fields={groupFields} />
                                    {dividerBottom && <Divider />}
                                </Fragment>
                        }
                    })}

                </Box>
            </Box>
        </Box>
    </Box>
}