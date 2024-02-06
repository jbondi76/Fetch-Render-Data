const Pagination = ({ items, pageSize, onPageChange }) => {
  const {Button} = ReactBootstrap; 
  // Part 2 code goes here
  if (items.length <= 1) return null;
  const numPages = Math.ceil(items.length/pageSize);
  const pages = range(1, numPages);
  const list = pages.map(page => {
    return (
      <button className='page-item btn btn-light' key={page} onClick={onPageChange}>{page}</button>
    )
  })
  return (
    <div class="btn-group">{list}</div>
  )
};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};

function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      // Part 1, step 1 code goes here
      dispatch({type: "FETCH_INIT"});
      try {
        const result = await axios(url);

        if (!didCancel) {
          dispatch({type: "FETCH_SUCCESS", payload: result.data })
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({type: "FETCH_FAILURE"})
        }
      }      
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// App that gets data from Hacker News url
function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState('MIT');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    // 'https://hn.algolia.com/api/v1/search?query=MIT',
    'https://any-api.com/nba_com/nba_com/docs/API_Description',
    {
      results: [],
      count: [],
    }
  );
  const handlePageChange = (e) => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.results;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }
  return (
    <Fragment>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        // Part 1, step 2 code goes here
        <ul className="list-group">
          {page.map((item) => (
            <li className="list-group-item" key={item.id}>
              <a className='link-light' href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
      <Pagination
        items={data.results}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById('root'));
