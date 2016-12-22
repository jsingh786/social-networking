<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class saved_jobs
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\job", inversedBy="savedJobs")
     * @ORM\JoinColumn(name="job_id", referencedColumnName="id")
     */
    private $job;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="savedJobs")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
    
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getJob() {
		return $this->job;
	}

	public function setJob($job) {
		$this->job = $job;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}
	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

}