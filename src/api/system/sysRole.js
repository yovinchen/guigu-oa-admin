import request from '@/utils/request'

/**
 * 角色管理相关的API请求函数
 *
 * @type {string}
 */
const api_name = '/admin/system/sysRole'

export default {

  /**
   * 获取角色分页列表(带搜索)
   * @param {*} page
   * @param {*} limit
   * @param {*} searchObj
   * @returns
   */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      // 如果是普通对象参数写法，params:对象参数名
      // 如果是使用json格式传递，data:对象参数名
      params: searchObj
    })
  },

  /**
   * 角色删除
   * @param {*} id
   * @returns
   */
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  /**
   * 角色添加
   * @param {*} role
   * @returns
   */
  save(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },

  /**
   * 回显要修改的id信息
   *
   * @param id
   * @returns {*}
   */
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  /** 修改
   *
   * @param role
   * @returns {*}
   */
  updateById(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },

  /**
   * 批量删除
   *
   * @param idList
   * @returns {*}
   */
  batchRemove(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: `delete`,
      data: idList
    })
  },
  /**
   * 根据用户获取角色数据
   *
   * @param adminId
   * @returns {*}
   */
  getRoles(adminId) {
    return request({
      url: `${api_name}/toAssign/${adminId}`,
      method: 'get'
    })
  },
  /**
   * 为用户分配角色
   *
   * @param assginRoleVo
   * @returns {*}
   */
  assignRoles(assginRoleVo) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      data: assginRoleVo
    })
  }
}
