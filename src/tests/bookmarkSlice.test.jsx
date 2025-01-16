// npm test

import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import bookmarkSlice, { fetchBookmarks, addBookmark, deleteBookmark } from '../Redux/Slices/bookmarksSlice';

describe('bookmarkSlice tests', () => {
  let mockAxios;
  let store;

  beforeEach(() => {
    // Set up Axios mock adapter
    mockAxios = new MockAdapter(axios);
    
    // Set up Redux store with bookmarksSlice
    store = configureStore({
      reducer: {
        bookmarks: bookmarkSlice,
      },
    });
  });

  afterEach(() => {
    // Reset Axios mock
    mockAxios.reset();
  });

  it('should return the initial state', () => {
    const initialState = {
      bookmarks: [],
      loading: false,
      error: null,
    };
    expect(bookmarkSlice(undefined, {})).toEqual(initialState);
  });

  it('should handle fetchBookmarks.pending', () => {
    const initialState = {
      bookmarks: [],
      loading: false,
      error: null,
    };

    const action = { type: fetchBookmarks.pending.type };
    const state = bookmarkSlice(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('should handle fetchBookmarks.fulfilled', async () => {
    const mockBookmarks = ['bookmark1', 'bookmark2'];
    
    mockAxios.onGet('https://movieapp-tu5n.onrender.com/user/getbookmark?userId=1').reply(200, { bookmarks: mockBookmarks });
    
    const expectedActions = [
      { type: fetchBookmarks.pending.type },
      { type: fetchBookmarks.fulfilled.type, payload: mockBookmarks },
    ];

    await store.dispatch(fetchBookmarks(1));
    
    const state = store.getState().bookmarks;
    expect(state.bookmarks).toEqual(mockBookmarks);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchBookmarks.rejected', async () => {
    const errorMessage = 'Failed to fetch bookmarks';
    
    mockAxios.onGet('https://movieapp-tu5n.onrender.com/user/getbookmark?userId=1').reply(500, { message: errorMessage });
    
    const expectedActions = [
      { type: fetchBookmarks.pending.type },
      { type: fetchBookmarks.rejected.type, payload: errorMessage },
    ];

    await store.dispatch(fetchBookmarks(1));
    
    const state = store.getState().bookmarks;
    expect(state.error).toEqual(errorMessage);
    expect(state.loading).toBe(false);
  });

  it('should handle addBookmark', async () => {
    const newBookmark = { name: 'bookmark3' };
    
    mockAxios.onPost('https://movieapp-tu5n.onrender.com/user/bookmark').reply(200, { bookmarks: [newBookmark] });
    
    const expectedActions = [
      { type: addBookmark.pending.type },
      { type: addBookmark.fulfilled.type, payload: [newBookmark] },
    ];

    await store.dispatch(addBookmark(newBookmark));
    
    const state = store.getState().bookmarks;
    expect(state.bookmarks).toContainEqual(newBookmark);
    expect(state.error).toBeNull();
  });

  it('should handle deleteBookmark', async () => {
    const initialBookmarks = ['bookmark1', 'bookmark2'];
    
    mockAxios.onDelete('https://movieapp-tu5n.onrender.com/user/deletebookmark').reply(200, { bookmarks: ['bookmark2'] });
    
    // Dispatching action to delete a bookmark
    await store.dispatch(deleteBookmark({ name: 'bookmark1' }));
    
    const state = store.getState().bookmarks;
    expect(state.bookmarks).toEqual(['bookmark2']);
    expect(state.error).toBeNull();
  });
});
