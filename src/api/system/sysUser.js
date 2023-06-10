import request from '@/utils/request'

/**
 * 用户管理相关的API请求函数
 *
 * @type {string}
 */
const api_name = '/admin/system/sysUser'

export default {
  /**
   * 用户条件分页查询
   *
   * @param page
   * @param limit
   * @param searchObj
   * @returns {AxiosPromise}
   */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj // url查询字符串或表单键值对
    })
  },
  /**
   * 获取用户
   *
   * @param id
   * @returns {AxiosPromise}
   */
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  /**
   * 保存用户
   *
   * @param role
   * @returns {AxiosPromise}
   */
  save(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },
  /**
   * 更新用户
   *
   * @param role
   * @returns {AxiosPromise}
   */
  updateById(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },
  /**
   * 删除用户
   *
   * @param id
   * @returns {AxiosPromise}
   */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  /**
   * 更新用户状态
   *
   * @param id
   * @param status
   * @returns {AxiosPromise}
   */
  updateStatus(id, status) {
    return request({
      url: `${api_name}/updateStatus/${id}/${status}`,
      method: 'get'
    })
  }
}
