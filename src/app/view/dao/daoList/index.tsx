import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Col, Empty, Row } from 'antd'
import DaoCard from './daoCard'
import SearchDao from './search'
import SortDao from './sortDao'
import TypeOfDAO from './typeOfDao'

import { AppState } from 'app/model'

import './index.less'
import useSearchDao from 'app/hooks/useSearchDao copy'

const DaoList = () => {
  const [sortKey, setSortKey] = useState('all-regime')
  const [searchKey, setSearchKey] = useState('')
  const {
    dao: { daoData },
  } = useSelector((state: AppState) => state)

  const filterDaoAddress = useMemo(() => {
    const daoAddresses = Object.keys(daoData)
    if (!daoAddresses.length) return []
    if (sortKey === 'all-regime') return daoAddresses

    const filteredAddress = []
    for (const daoAddress of daoAddresses) {
      const { regime } = daoData[daoAddress]
      const parseRegime = Object.keys(regime)[0]
      if (sortKey === parseRegime) filteredAddress.push(daoAddress)
    }
    return filteredAddress
  }, [daoData, sortKey])

  const { searchData, loading } = useSearchDao(searchKey, filterDaoAddress)

  return (
    <Row gutter={[24, 16]}>
      <Col xs={24} md={16}>
        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}>
            <TypeOfDAO />
          </Col>
          <Col xs={12} md={6}>
            <SortDao onSort={setSortKey} value={sortKey} />
          </Col>
          <Col xs={24} md={12}>
            <SearchDao onSearch={setSearchKey} loading={loading} />
          </Col>
        </Row>
      </Col>
      <Col span={24} />
      {searchKey.length >= 3 ? (
        <Col span={24} style={{ textAlign: 'center' }}>
          <Empty />
        </Col>
      ) : (
        (searchData || filterDaoAddress).map((daoAddress) => (
          <Col key={daoAddress} xs={24} md={12} xl={8}>
            <LazyLoad height={479.75}>
              <DaoCard daoAddress={daoAddress} special />
            </LazyLoad>
          </Col>
        ))
      )}
    </Row>
  )
}

export default DaoList
