/* eslint-disable import/order */
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import { Box, Button, Card, ClickAwayListener, IconButton, TextField, Tooltip, Typography, Zoom } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import { ChangeEvent, FC, useState } from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import Label from 'src/client/components/Label'
import { updateList } from 'src/client/slices/projects_board'
import { RootState, useDispatch, useSelector } from 'src/client/store/redux'

import Task from './Task'

import type { List as ListType } from 'src/client/models/projects_board'

const ListColumnWrapper = styled(Card)(
  ({ theme }) => `
      width: 340px;
      min-width: 340px;
      margin-right: ${theme.spacing(3)};
      border-top-width: 8px;
      border-top-style: solid;
  `
)

const IconButtonEdit = styled(IconButton)(
  ({ theme }) => `
      margin-right: ${theme.spacing(0.5)};
      padding: ${theme.spacing(0.4)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(17)};
        color: ${theme.colors.primary.main};
      }
  `
)

const ButtonAdd = styled(Button)(
  ({ theme }) => `
      background-color: ${theme.colors.alpha.black[10]};
      padding: ${theme.spacing(1)};
  `
)

interface ResultsProps {
  listId: string
}

const listSelector = (state: RootState, listId: string): ListType => {
  const { lists } = state.projectsBoard

  return lists.byId[listId]
}

const Results: FC<ResultsProps> = ({ listId }) => {
  const { t }: { t: any } = useTranslation()

  const list = useSelector((state) => listSelector(state, listId))
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [name, setName] = useState<string>(list.name)
  const [isRenaming, setRename] = useState<boolean>(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist()
    setName(event.target.value)
  }

  const handleRenameInit = (): void => {
    setRename(true)
  }

  const handleRename = async (): Promise<void> => {
    try {
      if (!name) {
        setName(list.name)
        setRename(false)
        return
      }

      const update = { name }

      setRename(false)
      await dispatch(updateList(list.id, update))
      enqueueSnackbar(t('The project board has been successfully updated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        TransitionComponent: Zoom,
      })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(t('There was an error, try again later'), {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        TransitionComponent: Zoom,
      })
    }
  }

  return (
    <ListColumnWrapper sx={{ borderColor: list.color }}>
      <Box px={2} pt={2} display="flex" justifyContent="space-between" alignItems="center">
        {isRenaming ? (
          <ClickAwayListener onClickAway={handleRename}>
            <TextField
              value={name}
              size="small"
              onBlur={handleRename}
              onChange={handleChange}
              variant="outlined"
              margin="dense"
            />
          </ClickAwayListener>
        ) : (
          <Typography color="inherit" variant="h3" onClick={handleRenameInit}>
            {list.name}
          </Typography>
        )}
        <Box display="flex" alignItems="center">
          <Tooltip arrow placement="top" title={t('Rename')}>
            <IconButtonEdit onClick={handleRenameInit}>
              <EditTwoToneIcon />
            </IconButtonEdit>
          </Tooltip>
          <Label color="primary">
            <b>{list.taskIds.length}</b>
          </Label>
        </Box>
      </Box>
      <Box px={2} pt={2}>
        <Tooltip placement="top" arrow title={t('Add new task')}>
          <ButtonAdd size="small" color="secondary" fullWidth>
            <AddTwoToneIcon fontSize="small" />
          </ButtonAdd>
        </Tooltip>
      </Box>
      {list.taskIds.length === 0 && (
        <Box p={4} textAlign="center">
          <Typography variant="subtitle2">{t('Drag tasks here to assign them to this board')}</Typography>
        </Box>
      )}
      <Droppable droppableId={list.id}>
        {(provided) => (
          <Box sx={{ minHeight: 260 }} ref={provided.innerRef}>
            {list.taskIds.map((taskId, index) => (
              <Draggable draggableId={taskId} index={index} key={taskId}>
                {/* eslint-disable-next-line no-shadow */}
                {(provided, snapshot) => (
                  <Task
                    taskId={taskId}
                    dragging={snapshot.isDragging}
                    index={index}
                    key={taskId}
                    list={list}
                    // @ts-ignore
                    ref={provided.innerRef}
                    style={{ ...provided.draggableProps.style }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      <Box px={2} pb={2}>
        <Tooltip placement="top" arrow title={t('Add new task')}>
          <ButtonAdd size="small" color="secondary" fullWidth>
            <AddTwoToneIcon fontSize="small" />
          </ButtonAdd>
        </Tooltip>
      </Box>
    </ListColumnWrapper>
  )
}

Results.propTypes = {
  listId: PropTypes.string.isRequired,
}

export default Results
