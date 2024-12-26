function ProfileContent({ data }: any) {
	return (
		<div>
			<h2>Data</h2>
			<p>{data.data()}</p>
		</div>
	)
}

export default ProfileContent
