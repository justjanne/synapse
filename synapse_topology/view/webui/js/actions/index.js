import {
  ADVANCE_UI,
  BACK_UI,
  SET_SERVERNAME,
  SET_STATS,
  BASE_CONFIG_CHECKED,
  FAIL,
  SET_SECRET_KEY,
  GETTING_SECRET_KEY,
  SET_DELEGATION,
  SET_DELEGATION_SERVERNAME,
  SET_REVERSE_PROXY,
  SET_TLS,
  TESTING_TLS_CERT_PATHS,
  SET_TLS_CERT_PATHS,
  SET_TLS_CERT_PATHS_VALIDITY,
  SET_TLS_CERT_FILES,
  UPLOADING_TLS_CERT_PATHS,
} from './types';

import {
  get_server_setup,
  post_server_name,
  fetch_secret_key,
  post_cert_paths,
  post_certs,
} from '../api';

export const startup = () => {
  return dispatch => {
    get_server_setup().then(
      result => dispatch(start(result)),
      error => dispatch(fail(error)),
    )
  }
}

export const generate_secret_keys = consent => {
  return (dispatch, getState) => {
    dispatch(getting_secret_keys());
    post_server_name(getState().base_config.servername, consent)
      .then(
        result => dispatch(get_secret_key()),
        error => dispatch(fail(error))
      )
  }
}

export const set_tls_cert_paths = (cert_path, cert_key_path) => {
  return dispatch => {
    dispatch(testing_tls_cert_paths(true));
    dispatch({
      type: SET_TLS_CERT_PATHS,
      cert_path,
      cert_key_path,
    })
    post_cert_paths(cert_path, cert_key_path)
      .then(
        result => dispatch(check_tls_cert_path_validity(result)),
        error => dispatch(fail(error))
      )
  }
}

const testing_tls_cert_paths = testing => ({
  type: TESTING_TLS_CERT_PATHS,
  testing,
});

const check_tls_cert_path_validity = ({ cert_path_invalid, cert_key_path_invalid }) => {
  return dispatch => {
    dispatch(testing_tls_cert_paths(false));
    dispatch(set_cert_path_validity({ cert_path_invalid, cert_key_path_invalid }));
    if (!cert_path_invalid && !cert_key_path_invalid) {
      dispatch(advance_ui());
    }
  }
}

export const upload_tls_cert_files = (tls_cert_file, tls_cert_key_file) =>
  dispatch => {
    dispatch(set_tls_cert_files(tls_cert_file, tls_cert_key_file));
    dispatch(uploading_tls_cert_files(true));
    post_certs(tls_cert_file, tls_cert_key_file)
      .then(
        result => {
          dispatch(uploading_tls_cert_files(false));
          dispatch(advance_ui())
        },
        error => dispatch(fail(error)),
      )
  }

const uploading_tls_cert_files = uploading => ({
  type: UPLOADING_TLS_CERT_PATHS,
  uploading
})

export const set_tls_cert_files = (tls_cert_file, tls_cert_key_file) => ({
  type: SET_TLS_CERT_FILES,
  tls_cert_file,
  tls_cert_key_file,
})
const set_cert_path_validity = ({ cert_path_invalid, cert_key_path_invalid }) => ({
  type: SET_TLS_CERT_PATHS_VALIDITY,
  cert_path_invalid,
  cert_key_path_invalid,
});

export const getting_secret_keys = () => ({
  type: GETTING_SECRET_KEY,
});

export const get_secret_key = () => {
  return dispatch => {
    fetch_secret_key().then(
      result => dispatch(set_secret_key(result)),
      error => dispatch(fail(error)),
    )
  }
}

export const set_secret_key = key => ({
  type: SET_SECRET_KEY,
  key,
});

export const start = server_setup => ({
  type: BASE_CONFIG_CHECKED,
  base_config_done: server_setup,
});

export const fail = reason => ({
  type: FAIL,
  reason,
});

export const advance_ui = option => ({
  type: ADVANCE_UI,
  option,
});

export const set_servername = servername => ({
  type: SET_SERVERNAME,
  servername,
});

export const set_stats = consent => ({
  type: SET_STATS,
  consent,
});

export const set_delegation = delegation_type => ({
  type: SET_DELEGATION,
  delegation_type,
});

export const set_delegation_servername = servername => ({
  type: SET_DELEGATION_SERVERNAME,
  servername,
});

export const set_reverse_proxy = proxy_type => ({
  type: SET_REVERSE_PROXY,
  proxy_type,
});

export const set_tls = tls_type => ({
  type: SET_TLS,
  tls_type,
});