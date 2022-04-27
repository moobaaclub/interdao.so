import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ProposalReturnType } from 'app/view/templates/types'

/**
 * Interface & Utility
 */

export type TemplateState = {
  visible: boolean
  tx?: ProposalReturnType
  imageBackground: string
}

/**
 * Store constructor
 */

const NAME = 'template'
const initialState: TemplateState = {
  visible: false,
  tx: undefined,
  imageBackground: '',
}

/**
 * Actions
 */

export const setVisible = createAsyncThunk(
  `${NAME}/setVisible`,
  async (visible: boolean) => {
    return { visible }
  },
)

export const setTx = createAsyncThunk(
  `${NAME}/setTx`,
  async (tx?: ProposalReturnType) => {
    return { tx }
  },
)

export const setImgBackground = createAsyncThunk(
  `${NAME}/setImgBackground`,
  async (image: string) => {
    return { imageBackground: image }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        setVisible.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTx.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setImgBackground.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer